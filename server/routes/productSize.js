const { ProductSize } = require("../models/productSize");
const express = require('express');
const router = express.Router();

// Route to get all product sizes
router.get(`/`, async (req, res) => {
    try {
        // Fetch all product sizes from the database
        const productSizeList = await ProductSize.find();

        // If no product sizes found, return an error response
        if (!productSizeList) {
            res.status(500).json({ success: false });
        }

        // Return the list of product sizes
        return res.status(200).json(productSizeList);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false });
    }
});

// Route to get a specific product size by ID
router.get('/:id', async (req, res) => {
    try {
        // Fetch the product size with the given ID
        const item = await ProductSize.findById(req.params.id);

        // If the item is not found, return a 500 error response
        if (!item) {
            res.status(500).json({ message: 'The item with the given ID was not found.' });
        }

        // Return the product size item
        return res.status(200).send(item);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false });
    }
});

// Route to create a new product size
router.post('/create', async (req, res) => {
    try {
        // Create a new ProductSize instance with the data from the request body
        let productsize = new ProductSize({
            size: req.body.size
        });

        // Save the new product size to the database
        productsize = await productsize.save();

        // Return the created product size
        res.status(201).json(productsize);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
});

// Route to delete a product size by ID
router.delete('/:id', async (req, res) => {
    try {
        // Delete the product size with the given ID
        const deletedItem = await ProductSize.findByIdAndDelete(req.params.id);

        // If the item is not found, return a 404 error response
        if (!deletedItem) {
            res.status(404).json({
                message: 'Item not found!',
                success: false
            });
        }

        // Return a success response
        res.status(200).json({
            success: true,
            message: 'Item Deleted!'
        });

    } catch (error) {
        // Handle any server errors
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route to update a product size by ID
router.put('/:id', async (req, res) => {
    try {
        // Update the product size with the given ID using the data from the request body
        const item = await ProductSize.findByIdAndUpdate(
            req.params.id,
            {
                size: req.body.size,
            },
            { new: true }
        );

        // If the item cannot be updated, return a 500 error response
        if (!item) {
            return res.status(500).json({
                message: 'Item cannot be updated!',
                success: false
            });
        }

        // Return the updated product size
        res.send(item);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
