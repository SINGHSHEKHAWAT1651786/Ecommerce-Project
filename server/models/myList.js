const mongoose = require('mongoose');

// Define the schema for user's saved items (My List)
const myListSchema = mongoose.Schema({
    productTitle: {
        type: String, // Title of the product
        required: true // This field is mandatory
    },
    image: {
        type: String, // URL of the product image
        required: true // This field is mandatory
    },
    rating: {
        type: Number, // Rating of the product
        required: true // This field is mandatory
    },
    price: {
        type: Number, // Price of the product
        required: true // This field is mandatory
    },
    productId: {
        type: String, // Unique identifier for the product
        required: true // This field is mandatory
    },
    userId: {
        type: String, // Unique identifier for the user who saved the item
        required: true // This field is mandatory
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
myListSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
myListSchema.set('toJSON', {
    virtuals: true,
});

// Export the MyList model and schema
exports.MyList = mongoose.model('MyList', myListSchema);
exports.myListSchema = myListSchema;
