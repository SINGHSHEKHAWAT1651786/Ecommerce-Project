const mongoose = require('mongoose');

// Define the schema for product reviews
const productReviewsSchema = mongoose.Schema({
    productId: {
        type: String, // Unique identifier for the product being reviewed
        required: true // This field is mandatory
    },
    customerName: {
        type: String, // Name of the customer who wrote the review
        required: true // This field is mandatory
    },
    customerId: {
        type: String, // Unique identifier for the customer
        required: true // This field is mandatory
    },
    review: {
        type: String, // Text of the review
        required: true, // This field is mandatory
        default: "" // Default value is an empty string if no review is provided
    },
    customerRating: {
        type: Number, // Rating given by the customer (e.g., 1 to 5 stars)
        required: true, // This field is mandatory
        default: 1 // Default rating is 1 if not provided
    },
    dateCreated: {
        type: Date, // Date when the review was created
        default: Date.now, // Default value is the current date and time
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
productReviewsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
productReviewsSchema.set('toJSON', {
    virtuals: true,
});

// Export the ProductReviews model and schema
exports.ProductReviews = mongoose.model('ProductReviews', productReviewsSchema);
exports.productReviewsSchema = productReviewsSchema;
