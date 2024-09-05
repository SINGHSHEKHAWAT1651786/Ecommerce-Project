const { Product } = require('../models/products.js');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

// Route to search for products based on a query
router.get('/', async (req, res) => {
    try {
        // Get the query parameter from the request
        const query = req.query.q;

        // If no query parameter is provided, return a 400 Bad Request response
        if (!query) {
            return res.status(400).json({ msg: 'Query is required' });
        }

        // Perform a case-insensitive search for products where any of the fields (name, brand, catName) match the query
        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } }
            ]
        });

        // Return the search results as JSON
        res.json(items);
    } catch (err) {
        // Handle any server errors by returning a 500 Internal Server Error response
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
