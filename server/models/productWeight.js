const mongoose = require('mongoose');

// Define the schema for product weights
const productWeightSchema = mongoose.Schema({
    productWeight: {
        type: String, // Weight of the product
        default: null // Default value is null if not provided
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
productWeightSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
productWeightSchema.set('toJSON', {
    virtuals: true,
});

// Export the ProductWeight model and schema
exports.ProductWeight = mongoose.model('ProductWeight', productWeightSchema);
exports.productWeightSchema = productWeightSchema;
