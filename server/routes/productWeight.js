const { ProductWeight } = require("../models/productWeight");
const express = require('express');
const router = express.Router();

// Route to get all product weights
router.get(`/`, async (req, res) => {
    try {
        // Fetch all product weights from the database
        const productWeightList = await ProductWeight.find();

        // If no product weights found, return an error response
        if (!productWeightList) {
            res.status(500).json({ success: false });
        }

        // Return the list of product weights
        return res.status(200).json(productWeightList);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false });
    }
});

// Route to get a specific product weight by ID
router.get('/:id', async (req, res) => {
    try {
        // Fetch the product weight with the given ID
        const item = await ProductWeight.findById(req.params.id);

        // If the item is not found, return a 500 error response
        if (!item) {
            res.status(500).json({ message: 'The item with the given ID was not found.' });
        }

        // Return the product weight item
        return res.status(200).send(item);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false });
    }
});

// Route to create a new product weight
router.post('/create', async (req, res) => {
    try {
        // Create a new ProductWeight instance with the data from the request body
        let productWeight = new ProductWeight({
            productWeight: req.body.productWeight
        });

        // Save the new product weight to the database
        productWeight = await productWeight.save();

        // Return the created product weight
        res.status(201).json(productWeight);

    } catch (error) {
        // Handle any server errors
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
});

// Route to delete a product weight by ID
router.delete('/:id', async (req, res) => {
    try {
        // Delete the product weight with the given ID
        const deletedItem = await ProductWeight.findByIdAndDelete(req.params.id);

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

// Route to update a product weight by ID
router.put('/:id', async (req, res) => {
    try {
        // Update the product weight with the given ID using the data from the request body
        const item = await ProductWeight.findByIdAndUpdate(
            req.params.id,
            {
                productWeight: req.body.productWeight,
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

        // Return the updated product weight
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
