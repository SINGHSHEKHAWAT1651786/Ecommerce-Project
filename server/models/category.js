const mongoose = require('mongoose');

// Define the schema for categories
const categorySchema = mongoose.Schema({
    name: {
        type: String, // Data type for the category name
        required: true // This field is mandatory
    },
    slug: {
        type: String, // Data type for the category slug (URL-friendly identifier)
        required: true, // This field is mandatory
        unique: true // Ensure that the slug is unique across categories
    },
    images: [
        {
            type: String, // Data type for image URLs associated with the category
        }
    ],
    color: {
        type: String, // Data type for the color associated with the category
    },
    parentId: {
        type: String // Data type for the parent category ID, if any
    }
}, { timestamps: true }); // Automatically add `createdAt` and `updatedAt` fields

// Add a virtual property 'id' that returns the document's _id as a string
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
categorySchema.set('toJSON', {
    virtuals: true,
});

// Export the Category model and schema
exports.Category = mongoose.model('Category', categorySchema);
exports.categorySchema = categorySchema;
