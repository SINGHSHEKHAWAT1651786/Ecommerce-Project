const { Category } = require("../models/category"); // Import Category model
const { ImageUpload } = require("../models/imageUpload"); // Import ImageUpload model
const express = require("express"); // Import Express
const router = express.Router(); // Create an Express router
const multer = require("multer"); // Import Multer for handling file uploads
const fs = require("fs"); // Import File System module
const slugify = require("slugify"); // Import Slugify for generating slugs

const cloudinary = require("cloudinary").v2; // Import Cloudinary for image uploads

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

var imagesArr = []; // Array to store image URLs

// Configure Multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`); // Generate unique filename
  },
});

const upload = multer({ storage: storage }); // Create Multer upload instance

// Route to handle image uploads
router.post(`/upload`, upload.array("images"), async (req, res) => {
  imagesArr = []; // Reset image array

  try {
    // Upload each image to Cloudinary
    for (let i = 0; i < req?.files?.length; i++) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      // Upload image and push its URL to imagesArr
      const img = await cloudinary.uploader.upload(
        req.files[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${req.files[i].filename}`); // Remove file after upload
        }
      );
    }

    // Save image URLs to the database
    let imagesUploaded = new ImageUpload({
      images: imagesArr,
    });

    imagesUploaded = await imagesUploaded.save();
    return res.status(200).json(imagesArr); // Send image URLs as response
  } catch (error) {
    console.log(error); // Log error if any
  }
});

// Helper function to create a hierarchical list of categories
const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;

  // Filter categories based on parentId
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }
  
  // Recursively create category hierarchy
  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      id: cat._id,
      name: cat.name,
      images: cat.images,
      color: cat.color,
      slug: cat.slug,
      children: createCategories(categories, cat._id)
    });
  }

  return categoryList;
};

// Route to get all categories
router.get(`/`, async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      res.status(500).json({ success: false });
    }

    if (categoryList) {
      const categoryData = createCategories(categoryList);

      return res.status(200).json({
        categoryList: categoryData
      });
    }

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Route to get the count of top-level categories
router.get(`/get/count`, async (req, res) => {
  const categoryCount = await Category.countDocuments({ parentId: undefined });

  if (!categoryCount) {
    res.status(500).json({ success: false });
  } else {
    res.send({
      categoryCount: categoryCount,
    });
  }
});

// Route to get the count of subcategories
router.get(`/subCat/get/count`, async (req, res) => {
  const categoryCount = await Category.find();

  if (!categoryCount) {
    res.status(500).json({ success: false });
  } else {
    const subCatList = [];
    for (let cat of categoryCount) {
      if (cat.parentId !== undefined) {
        subCatList.push(cat);
      }
    }

    res.send({
      categoryCount: subCatList.length,
    });
  }
});

// Helper function to create a single category with its children
const createCat = (categories, parentId = null, cat) => {
  const categoryList = [];
  let category;

  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  categoryList.push({
    _id: cat._id,
    id: cat._id,
    name: cat.name,
    images: cat.images,
    color: cat.color,
    slug: cat.slug,
    children: category
  });

  return categoryList;
};

// Route to get a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    const categoryList = await Category.find();
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(500).json({ message: "The category with the given ID was not found." });
    }

    if (category) {
      const categoryData = createCat(categoryList, category._id, category);

      return res.status(200).json({
        categoryData
      });
    }

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Route to create a new category
router.post("/create", async (req, res) => {
  let catObj = {};

  if (imagesArr.length > 0) {
    catObj = {
      name: req.body.name,
      images: imagesArr,
      color: req.body.color,
      slug: req.body.name,
    };
  } else {
    catObj = {
      name: req.body.name,
      slug: req.body.name,
    };
  }

  if (req.body.parentId) {
    catObj.parentId = req.body.parentId;
  }

  let category = new Category(catObj);

  if (!category) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }

  category = await category.save();

  imagesArr = []; // Reset image array

  res.status(201).json(category);
});

// Route to delete an image from Cloudinary
router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;

  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  const response = await cloudinary.uploader.destroy(
    imageName,
    (error, result) => {
      // Handle Cloudinary response
    }
  );

  if (response) {
    res.status(200).send(response);
  }
});

// Route to delete a category by ID and its associated images from Cloudinary
router.delete("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  const images = category.images;

  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    cloudinary.uploader.destroy(imageName, (error, result) => {
      // Handle Cloudinary response
    });
  }

  const deletedCategory = await Category.findByIdAndDelete(req.params.id);

  if (!deletedCategory) {
    res.status(404).json({
      message: "Category not found!",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Category Deleted!",
  });
});

// Route to update a category by ID
router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      images: req.body.images,
      color: req.body.color,
    },
    { new: true } // Return the updated document
  );

  if (!category) {
    return res.status(500).json({
      message: "Category cannot be updated!",
      success: false,
    });
  }

  imagesArr = []; // Reset image array

  res.send(category);
});

module.exports = router; // Export the router
