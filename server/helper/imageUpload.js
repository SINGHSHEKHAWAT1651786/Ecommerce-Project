const express = require('express');
const router = express.Router();
// Import the ImageUpload model from the specified file
const { ImageUpload } = require('../models/imageUpload.js');

// Route to get all images
router.get(`/`, async (req, res) => {
    try {
        // Fetch all images from the database
        const imageUploadList = await ImageUpload.find();

        // Check if no images were found
        if (!imageUploadList) {
            // Send a 500 status code with a failure message if no images are found
            res.status(500).json({ success: false });
        }

        // Send a 200 status code with the list of images
        return res.status(200).json(imageUploadList);
    } catch (error) {
        // Handle any errors that occur and send a 500 status code with a failure message
        res.status(500).json({ success: false });
    }
});

// Route to delete all images
router.delete('/deleteAllImages', async (req, res) => {
    // Fetch all images from the database
    const images = await ImageUpload.find();
    let deletedImage;

    // Check if there are images to delete
    if (images.length !== 0) {
        // Loop through each image and delete it
        for (image of images) {
            deletedImage = await ImageUpload.findByIdAndDelete(image.id);
            // Optional: Log the deleted image for debugging
            
        }
    }

    // Send a response with the last deleted image (or undefined if no images were deleted)
    res.json(deletedImage);
});

module.exports = router;
