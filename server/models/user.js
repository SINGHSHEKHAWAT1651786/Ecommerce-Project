const mongoose = require('mongoose');

// Define the schema for users
const userSchema = mongoose.Schema({
    name: {
        type: String, // User's name
        required: true // Field is required
    },
    phone: {
        type: String, // User's phone number
        unique: true // Phone number must be unique
    },
    email: {
        type: String, // User's email address
        required: true, // Field is required
        unique: true // Email address must be unique
    },
    password: {
        type: String, // User's password
        // Optional: Consider adding validation or constraints for password
    },
    images: [
        {
            type: String, // Array of image URLs or paths
            required: true // Field is required
        }
    ],
    isAdmin: {
        type: Boolean, // Indicates if the user is an admin
        default: false, // Default value is false
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
userSchema.set('toJSON', {
    virtuals: true,
});

// Export the User model
exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
