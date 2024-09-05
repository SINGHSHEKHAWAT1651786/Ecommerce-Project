const { MyList } = require('../models/myList');
const express = require('express');
const router = express.Router();

// Route to get all items in the list
router.get(`/`, async (req, res) => {
    try {
        // Find items based on query parameters
        const myList = await MyList.find(req.query);

        if (!myList) {
            // Handle case where no items are found
            return res.status(500).json({ success: false });
        }

        // Send the list of items as the response
        return res.status(200).json(myList);

    } catch (error) {
        // Handle server errors
        res.status(500).json({ success: false });
    }
});

// Route to add a new item to the list
router.post('/add', async (req, res) => {
    // Check if the item already exists in the list
    const item = await MyList.find({ productId: req.body.productId, userId: req.body.userId });

    if (item.length === 0) {
        // Create a new item if it does not already exist
        let list = new MyList({
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            productId: req.body.productId,
            userId: req.body.userId
        });

        if (!list) {
            // Handle case where item could not be created
            return res.status(500).json({
                error: err,
                success: false
            });
        }

        // Save the new item to the database
        list = await list.save();

        // Send the created item as the response
        res.status(201).json(list);
    } else {
        // Respond with a message if the item is already in the list
        res.status(401).json({ status: false, msg: "Product already added to the My List" });
    }
});

// Route to delete an item by ID
router.delete('/:id', async (req, res) => {
    // Find the item by ID
    const item = await MyList.findById(req.params.id);

    if (!item) {
        // Handle case where item is not found
        return res.status(404).json({ msg: "The item with the given ID is not found!" });
    }

    // Delete the item by ID
    const deletedItem = await MyList.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        // Handle case where deletion fails
        return res.status(404).json({
            message: 'Item not found!',
            success: false
        });
    }

    // Send success response
    res.status(200).json({
        success: true,
        message: 'Item Deleted!'
    });
});

// Route to get a specific item by ID
router.get('/:id', async (req, res) => {
    // Find the item by ID
    const item = await MyList.findById(req.params.id);

    if (!item) {
        // Handle case where item is not found
        return res.status(500).json({ message: 'The item with the given ID was not found.' });
    }
    
    // Send the found item as the response
    return res.status(200).send(item);
});

module.exports = router;
