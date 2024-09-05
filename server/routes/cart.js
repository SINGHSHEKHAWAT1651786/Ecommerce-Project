const { Cart } = require('../models/cart'); // Import the Cart model
const express = require('express');
const router = express.Router();

// Route to get all cart items, optionally filtered by query parameters
router.get(`/`, async (req, res) => {
    try {
        // Find all cart items based on query parameters
        const cartList = await Cart.find(req.query);

        // If no items found, send a 500 error
        if (!cartList) {
            return res.status(500).json({ success: false, message: 'No items found' });
        }

        // Send the found cart items
        return res.status(200).json(cartList);

    } catch (error) {
        // Handle any errors
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Route to add a new item to the cart
router.post('/add', async (req, res) => {
    try {
        // Check if the item already exists in the cart for the user
        const cartItem = await Cart.find({ productId: req.body.productId, userId: req.body.userId });

        if (cartItem.length === 0) {
            // Create a new cart item
            let cartList = new Cart({
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                quantity: req.body.quantity,
                subTotal: req.body.subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                countInStock: req.body.countInStock,
            });

            // Save the new cart item
            cartList = await cartList.save();
    
            // Send the newly created cart item
            return res.status(201).json(cartList);
        } else {
            // Item already exists in the cart
            return res.status(401).json({ status: false, msg: "Product already added to the cart" });
        }
    } catch (err) {
        // Handle errors
        return res.status(500).json({ error: err.message, success: false });
    }
});

// Route to delete a cart item by ID
router.delete('/:id', async (req, res) => {
    try {
        // Find the item to be deleted
        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ msg: "The cart item with the given ID was not found!" });
        }

        // Delete the item
        const deletedItem = await Cart.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found!', success: false });
        }

        // Send success response
        return res.status(200).json({ success: true, message: 'Cart Item Deleted!' });
    } catch (err) {
        // Handle errors
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Route to get a specific cart item by ID
router.get('/:id', async (req, res) => {
    try {
        // Find the cart item by ID
        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.status(500).json({ message: 'The cart item with the given ID was not found.' });
        }

        // Send the found cart item
        return res.status(200).send(cartItem);
    } catch (err) {
        // Handle errors
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Route to update a cart item by ID
router.put('/:id', async (req, res) => {
    try {
        // Update the cart item by ID
        const cartList = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                quantity: req.body.quantity,
                subTotal: req.body.subTotal,
                productId: req.body.productId,
                userId: req.body.userId
            },
            { new: true } // Return the updated document
        );

        if (!cartList) {
            return res.status(500).json({ message: 'Cart item cannot be updated!', success: false });
        }

        // Send the updated cart item
        return res.send(cartList);
    } catch (err) {
        // Handle errors
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
