const mongoose = require('mongoose');

// Define the schema for product sizes
const productSizeSchema = mongoose.Schema({
    size: {
        type: String, // Size of the product
        default: null // Default value is null if not provided
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
productSizeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
productSizeSchema.set('toJSON', {
    virtuals: true,
});

// Export the ProductSize model
exports.ProductSize = mongoose.model('ProductSize', productSizeSchema);
exports.productSizeSchema = productSizeSchema;
