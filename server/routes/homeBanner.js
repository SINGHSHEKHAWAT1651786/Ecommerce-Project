const { HomeBanner } = require('../models/homeBanner');
const { ImageUpload } = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

// Array to store image URLs temporarily
var imagesArr = [];

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Set the destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); // Generate a unique filename
    },
})

const upload = multer({ storage: storage });

// Route to handle image uploads and save them to Cloudinary
router.post(`/upload`, upload.array("images"), async (req, res) => {
    imagesArr = []; // Clear the array at the start

    try {
        // Upload each file to Cloudinary and store the URLs
        for (let i = 0; i < req?.files?.length; i++) {
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const img = await cloudinary.uploader.upload(req.files[i].path, options, function (error, result) {
                imagesArr.push(result.secure_url); // Store the image URL
                fs.unlinkSync(`uploads/${req.files[i].filename}`); // Remove the file from local storage
            });
        }

        // Save the image URLs to the ImageUpload model
        let imagesUploaded = new ImageUpload({
            images: imagesArr,
        });

        imagesUploaded = await imagesUploaded.save();
        return res.status(200).json(imagesArr); // Send the image URLs back as the response

    } catch (error) {
        console.log(error); // Log errors to the console
    }
});

// Route to get all banner images
router.get(`/`, async (req, res) => {
    try {
        const bannerImagesList = await HomeBanner.find(); // Fetch all banner images

        if (!bannerImagesList) {
            res.status(500).json({ success: false }); // Handle error if no images are found
        }

        return res.status(200).json(bannerImagesList); // Send the list of banner images
    } catch (error) {
        res.status(500).json({ success: false }); // Handle server errors
    }
});

// Route to get a specific banner image by ID
router.get('/:id', async (req, res) => {
    slideEditId = req.params.id; // Extract ID from the request parameters

    const slide = await HomeBanner.findById(req.params.id); // Find the banner by ID

    if (!slide) {
        res.status(500).json({ message: 'The slide with the given ID was not found.' }); // Handle error if not found
    }
    return res.status(200).send(slide); // Send the slide data back
})

// Route to create a new banner entry
router.post('/create', async (req, res) => {
    let newEntry = new HomeBanner({
        images: imagesArr, // Set the images array
    });

    if (!newEntry) {
        res.status(500).json({
            error: err,
            success: false
        });
    }

    newEntry = await newEntry.save(); // Save the new entry
    imagesArr = []; // Clear the array after saving

    res.status(201).json(newEntry); // Send the created entry back
});

// Route to delete an image from Cloudinary
router.delete('/deleteImage', async (req, res) => {
    const imgUrl = req.query.img; // Get image URL from the query string

    const urlArr = imgUrl.split('/');
    const image = urlArr[urlArr.length - 1]; // Extract the image filename

    const imageName = image.split('.')[0]; // Remove the file extension

    const response = await cloudinary.uploader.destroy(imageName, (error, result) => {
        // Handle response
    });

    if (response) {
        res.status(200).send(response); // Send response after deletion
    }
});

// Route to delete a banner by ID
router.delete('/:id', async (req, res) => {
    const item = await HomeBanner.findById(req.params.id); // Find the banner by ID
    const images = item.images; // Get images associated with the banner

    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1]; // Extract the image filename

        const imageName = image.split('.')[0]; // Remove the file extension

        cloudinary.uploader.destroy(imageName, (error, result) => {
            // Handle response
        });
    }

    const deletedItem = await HomeBanner.findByIdAndDelete(req.params.id); // Delete the banner entry

    if (!deletedItem) {
        res.status(404).json({
            message: 'Slide not found!',
            success: false
        });
    }

    res.status(200).json({
        success: true,
        message: 'Slide Deleted!' // Send success message
    });
});

// Route to update a banner by ID
router.put('/:id', async (req, res) => {
    const slideItem = await HomeBanner.findByIdAndUpdate(
        req.params.id,
        {
            images: req.body.images, // Update images
        },
        { new: true } // Return the updated entry
    );

    if (!slideItem) {
        return res.status(500).json({
            message: 'Item cannot be updated!',
            success: false
        });
    }

    imagesArr = []; // Clear the array after updating

    res.send(slideItem); // Send the updated item back
});

module.exports = router; // Export the router
