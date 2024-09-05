const { User } = require('../models/user');
const { ImageUpload } = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require("fs");
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

var imagesArr = [];

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Route for uploading images to Cloudinary
router.post(`/upload`, upload.array("images"), async (req, res) => {
    imagesArr = []; // Clear the images array

    try {
        // Upload each image to Cloudinary
        for (let i = 0; i < req.files.length; i++) {
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const img = await cloudinary.uploader.upload(req.files[i].path, options);
            imagesArr.push(img.secure_url);
            fs.unlinkSync(`uploads/${req.files[i].filename}`); // Remove the file from local storage
        }

        // Save image URLs to the database
        let imagesUploaded = new ImageUpload({
            images: imagesArr,
        });

        imagesUploaded = await imagesUploaded.save();

        return res.status(200).json(imagesArr);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: 'Error uploading images' });
    }
});

// Route for user signup
router.post(`/signup`, async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        const existingUserByPh = await User.findOne({ phone: phone });

        if (existingUser || existingUserByPh) {
            return res.status(400).json({ error: true, msg: "User already exists!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin
        });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: result,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

// Route for user signin
router.post(`/signin`, async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Invalid credentials" });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        return res.status(200).send({
            user: existingUser,
            token: token,
            msg: "User authenticated"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

// Route for changing user password and updating details
router.put(`/changePassword/:id`, async (req, res) => {
    const { name, phone, email, password, newPass, images } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Current password is incorrect" });
        }

        const newPassword = newPass ? bcrypt.hashSync(newPass, 10) : existingUser.password;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phone: phone,
                email: email,
                password: newPassword,
                images: images,
            },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ error: true, msg: 'User cannot be updated!' });
        }

        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

// Route to get all users
router.get(`/`, async (req, res) => {
    try {
        const userList = await User.find();
        res.send(userList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Route to get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User with the given ID was not found.' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// Route to delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            return res.status(200).json({ success: true, message: 'User deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get the count of users
router.get(`/get/count`, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.send({ userCount: userCount });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Route for Google authentication
router.post(`/authWithGoogle`, async (req, res) => {
    const { name, phone, email, password, images, isAdmin } = req.body;

    try {
        let existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            existingUser = await User.create({
                name: name,
                phone: phone,
                email: email,
                password: password,
                images: images,
                isAdmin: isAdmin
            });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).send({
            user: existingUser,
            token: token,
            msg: "User login successfully!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

// Route to update user details
router.put('/:id', async (req, res) => {
    const { name, phone, email } = req.body;

    try {
        const userExist = await User.findById(req.params.id);

        const newPassword = req.body.password ? bcrypt.hashSync(req.body.password, 10) : userExist.password;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phone: phone,
                email: email,
                password: newPassword,
                images: imagesArr,
            },
            { new: true }
        );

        if (!user) {
            return res.status(400).send('User cannot be updated!');
        }

        res.send(user);
    } catch (error) {
        res.status(500).send('Error updating user');
    }
});

// Route to delete an image from Cloudinary
router.delete('/deleteImage', async (req, res) => {
    const imgUrl = req.query.img;

    const urlArr = imgUrl.split('/');
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split('.')[0];

    try {
        const response = await cloudinary.uploader.destroy(imageName);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "Error deleting image" });
    }
});

module.exports = router;
