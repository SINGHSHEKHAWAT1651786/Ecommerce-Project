const mongoose = require("mongoose");

// Define the schema for products
const productSchema = mongoose.Schema({
    name: {
        type: String, // Name of the product
        required: true, // This field is mandatory
    },
    description: {
        type: String, // Description of the product
        required: true // This field is mandatory
    },
    images: [
        {
            type: String, // Array of image URLs for the product
            required: true // This field is mandatory
        }
    ],
    brand: {
        type: String, // Brand of the product
        default: '' // Default value is an empty string if not provided
    },
    price: {
        type: Number, // Current price of the product
        default: 0 // Default value is 0 if not provided
    },
    oldPrice: {
        type: Number, // Previous price of the product (if on sale)
        default: 0 // Default value is 0 if not provided
    },
    catName: {
        type: String, // Name of the category
        default: '' // Default value is an empty string if not provided
    },
    catId: {
        type: String, // Unique identifier for the category
        default: '' // Default value is an empty string if not provided
    },
    subCatId: {
        type: String, // Unique identifier for the subcategory
        default: '' // Default value is an empty string if not provided
    },
    subCat: {
        type: String, // Name of the subcategory
        default: '' // Default value is an empty string if not provided
    },
    subCatName: {
        type: String, // Name of the sub-subcategory (if applicable)
        default: '' // Default value is an empty string if not provided
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
        ref: 'Category', // The model to which this field refers
        required: true // This field is mandatory
    },
    countInStock: {
        type: Number, // Quantity of the product available in stock
        required: true, // This field is mandatory
    },
    rating: {
        type: Number, // Average rating of the product
        default: 0, // Default value is 0 if not provided
    },
    isFeatured: {
        type: Boolean, // Indicates whether the product is featured
        default: false, // Default value is false if not provided
    },
    discount: {
        type: Number, // Discount on the product price
        required: true, // This field is mandatory
    },
    productRam: [
        {
            type: String, // Array of RAM options available for the product
            default: null, // Default value is null if not provided
        }
    ],
    size: [
        {
            type: String, // Array of size options available for the product
            default: null, // Default value is null if not provided
        }
    ],
    productWeight: [
        {
            type: String, // Array of weight options for the product
            default: null, // Default value is null if not provided
        }
    ],
    location: {
        type: String, // Location where the product is available
        default: "All" // Default value is "All" if not provided
    },
    dateCreated: {
        type: Date, // Date when the product was created
        default: Date.now, // Default value is the current date and time
    },
});

// Add a virtual property 'id' that returns the document's _id as a string
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
productSchema.set('toJSON', {
    virtuals: true,
});

// Export the Product model
exports.Product = mongoose.model('Product', productSchema);
