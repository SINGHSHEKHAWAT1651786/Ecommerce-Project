const { ProductReviews } = require('../models/productReviews');
const express = require('express');
const router = express.Router();

// Route to get all reviews, optionally filtered by productId
router.get(`/`, async (req, res) => {
    let reviews = [];

    try {
        // Check if a productId is provided in the query
        if (req.query.productId) {
            // Fetch reviews for the specified productId
            reviews = await ProductReviews.find({ productId: req.query.productId });
        } else {
            // Fetch all reviews
            reviews = await ProductReviews.find();
        }

        // Handle case where no reviews are found
        if (!reviews) {
            return res.status(500).json({ success: false });
        }

        // Send the list of reviews as the response
        return res.status(200).json(reviews);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to get the total count of product reviews
router.get(`/get/count`, async (req, res) => {
    try {
        // Count the total number of product reviews
        const productsReviews = await ProductReviews.countDocuments();

        // Handle case where count could not be retrieved
        if (!productsReviews) {
            return res.status(500).json({ success: false });
        }

        // Send the count of reviews as the response
        return res.send({ productsReviews: productsReviews });

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to get a specific review by ID
router.get('/:id', async (req, res) => {
    try {
        // Find review by ID
        const review = await ProductReviews.findById(req.params.id);

        // Handle case where review is not found
        if (!review) {
            return res.status(500).json({ message: 'The review with the given ID was not found.' });
        }
        
        // Send the found review as the response
        return res.status(200).send(review);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to add a new review
router.post('/add', async (req, res) => {
    try {
        // Create a new review instance
        let review = new ProductReviews({
            customerId: req.body.customerId,
            customerName: req.body.customerName,
            review: req.body.review,
            customerRating: req.body.customerRating,
            productId: req.body.productId
        });

        // Save the new review to the database
        review = await review.save();

        // Send the created review as the response
        return res.status(201).json(review);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ error: error.message, success: false });
    }
});

module.exports = router;
