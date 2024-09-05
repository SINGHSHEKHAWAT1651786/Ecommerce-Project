const mongoose = require('mongoose');

// Define the schema for subcategories
const subCatSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
        ref: 'Category', // Reference model name
        required: true // Field is required
    },
    subCat: {
        type: String, // Name of the subcategory
        required: true // Field is required
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
subCatSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
subCatSchema.set('toJSON', {
    virtuals: true,
});

// Export the SubCategory model
exports.SubCategory = mongoose.model('SubCategory', subCatSchema);
exports.subCatSchema = subCatSchema;
