const { SubCategory } = require('../models/subCat');
const express = require('express');
const router = express.Router();

// Route to get a list of subcategories with pagination
router.get(`/`, async (req, res) => {
    try {
        // Get the current page and items per page from query parameters
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10; // Default to 10 if not provided

        // Get total number of subcategories
        const totalPosts = await SubCategory.countDocuments();

        // Calculate total number of pages
        const totalPages = Math.ceil(totalPosts / perPage);

        let subCtegoryList = [];

        // If requested page is greater than total pages, return a 404 Not Found
        if (page > totalPages) {
            return res.status(404).json({ message: "No data found!" });
        }

        // Fetch subcategories based on pagination if both page and perPage are provided
        if (req.query.page !== undefined && req.query.perPage !== undefined) {
            subCtegoryList = await SubCategory.find().populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        } else {
            // Fetch all subcategories if pagination parameters are not provided
            subCtegoryList = await SubCategory.find().populate("category");
        }

        // Return the subcategories along with pagination info
        return res.status(200).json({
            "subCategoryList": subCtegoryList,
            "totalPages": totalPages,
            "page": page
        });

    } catch (error) {
        // Handle any errors with a 500 Internal Server Error response
        res.status(500).json({ success: false });
    }
});

// Route to get the count of subcategories
router.get(`/get/count`, async (req, res) => {
    const subCatCount = await SubCategory.countDocuments();

    if (!subCatCount) {
        return res.status(500).json({ success: false });
    }

    // Return the count of subcategories
    res.send({
        subCatCount: subCatCount
    });
});

// Route to get a specific subcategory by ID
router.get('/:id', async (req, res) => {
    console.log(req.params.id); // Log the ID for debugging

    // Find and populate the category for the given subcategory ID
    const subCat = await SubCategory.findById(req.params.id).populate("category");

    if (!subCat) {
        return res.status(500).json({ message: 'The sub category with the given ID was not found.' });
    }
    // Return the subcategory details
    return res.status(200).send(subCat);
});

// Route to create a new subcategory
router.post('/create', async (req, res) => {
    // Create a new subcategory with data from the request body
    let subCat = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat
    });

    // Save the new subcategory to the database
    subCat = await subCat.save();

    // Return the created subcategory
    res.status(201).json(subCat);
});

// Route to delete a subcategory by ID
router.delete('/:id', async (req, res) => {
    // Find and delete the subcategory by ID
    const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deletedSubCat) {
        return res.status(404).json({
            message: 'Sub Category not found!',
            success: false
        });
    }

    // Return success message
    res.status(200).json({
        success: true,
        message: 'Sub Category Deleted!'
    });
});

// Route to update a subcategory by ID
router.put('/:id', async (req, res) => {
    // Find and update the subcategory by ID with new data
    const subCat = await SubCategory.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category,
            subCat: req.body.subCat,
        },
        { new: true } // Return the updated document
    );

    if (!subCat) {
        return res.status(500).json({
            message: 'Sub Category cannot be updated!',
            success: false
        });
    }

    // Return the updated subcategory
    res.send(subCat);
});

module.exports = router;
