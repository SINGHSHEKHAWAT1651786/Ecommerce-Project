const mongoose = require('mongoose');

// Define the schema for image uploads
const imageUploadSchema = mongoose.Schema({
    images: [
        {
            type: String, // Data type for image URLs associated with the upload
            required: true // This field is mandatory
        }
    ]
});

// Add a virtual property 'id' that returns the document's _id as a string
imageUploadSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
imageUploadSchema.set('toJSON', {
    virtuals: true,
});

// Export the ImageUpload model and schema
exports.ImageUpload = mongoose.model('ImageUpload', imageUploadSchema);
exports.imageUploadSchema = imageUploadSchema;
