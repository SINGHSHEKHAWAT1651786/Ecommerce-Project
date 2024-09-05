const mongoose = require('mongoose');

// Define the schema for the cart
const cartSchema = mongoose.Schema({
    productTitle: {
        type: String, // Data type of the product title
        required: true // This field is mandatory
    },
    image: {
        type: String, // Data type of the image URL
        required: true // This field is mandatory
    },
    rating: {
        type: Number, // Data type of the product rating
        required: true // This field is mandatory
    },
    price: {
        type: Number, // Data type of the product price
        required: true // This field is mandatory
    },
    quantity: {
        type: Number, // Data type of the product quantity
        required: true // This field is mandatory
    },
    subTotal: {
        type: Number, // Data type of the subtotal for the product
        required: true // This field is mandatory
    },
    productId: {
        type: String, // Data type of the product ID
        required: true // This field is mandatory
    },
    countInStock: {
        type: Number, // Data type of the count in stock
        required: true // This field is mandatory
    },
    userId: {
        type: String, // Data type of the user ID
        required: true // This field is mandatory
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
cartSchema.set('toJSON', {
    virtuals: true,
});

// Export the Cart model and schema
exports.Cart = mongoose.model('Cart', cartSchema);
exports.cartSchema = cartSchema;
