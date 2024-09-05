const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();

// Route to get all orders, optionally filtered by query parameters
router.get(`/`, async (req, res) => {
    try {
        // Fetch orders based on query parameters
        const ordersList = await Orders.find(req.query);

        if (!ordersList) {
            // Handle case where no orders are found
            return res.status(500).json({ success: false });
        }

        // Send the list of orders as the response
        return res.status(200).json(ordersList);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        // Find order by ID
        const order = await Orders.findById(req.params.id);

        if (!order) {
            // Handle case where order is not found
            return res.status(500).json({ message: 'The order with the given ID was not found.' });
        }
        
        // Send the found order as the response
        return res.status(200).send(order);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to get the total count of orders
router.get(`/get/count`, async (req, res) => {
    try {
        // Count the total number of orders
        const orderCount = await Orders.countDocuments();

        if (!orderCount) {
            // Handle case where count could not be retrieved
            return res.status(500).json({ success: false });
        }

        // Send the count of orders as the response
        return res.send({ orderCount: orderCount });

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to create a new order
router.post('/create', async (req, res) => {
    try {
        // Create a new order instance
        let order = new Orders({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            paymentId: req.body.paymentId,
            email: req.body.email,
            userid: req.body.userid,
            products: req.body.products,
        });

        if (!order) {
            // Handle case where order could not be created
            return res.status(500).json({ error: err, success: false });
        }

        // Save the new order to the database
        order = await order.save();

        // Send the created order as the response
        return res.status(201).json(order);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        // Find and delete the order by ID
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            // Handle case where order could not be found for deletion
            return res.status(404).json({ message: 'Order not found!', success: false });
        }

        // Send success response
        return res.status(200).json({ success: true, message: 'Order Deleted!' });

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

// Route to update an order by ID
router.put('/:id', async (req, res) => {
    try {
        // Update the order with new data
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                pincode: req.body.pincode,
                amount: req.body.amount,
                paymentId: req.body.paymentId,
                email: req.body.email,
                userid: req.body.userid,
                products: req.body.products,
                status: req.body.status
            },
            { new: true }
        );

        if (!order) {
            // Handle case where order could not be updated
            return res.status(500).json({ message: 'Order cannot be updated!', success: false });
        }

        // Send the updated order as the response
        return res.send(order);

    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
