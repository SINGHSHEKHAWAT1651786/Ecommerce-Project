const mongoose = require("mongoose");

// Define the schema for recently viewed products
const recentlyViewdSchema = mongoose.Schema({
    prodId: {
        type: String, // Product ID for the recently viewed item
        default: '' // Default value is an empty string if not provided
    },
    name: {
        type: String, // Name of the product
        required: true // Field is required
    },
    description: {
        type: String, // Description of the product
        required: true // Field is required
    },
    images: [
        {
            type: String, // Array of image URLs for the product
            required: true // Field is required
        }
    ],
    brand: {
        type: String, // Brand name of the product
        default: '' // Default value is an empty string if not provided
    },
    price: {
        type: Number, // Current price of the product
        default: 0 // Default value is 0 if not provided
    },
    oldPrice: {
        type: Number, // Previous price of the product (if any)
        default: 0 // Default value is 0 if not provided
    },
    catName: {
        type: String, // Category name of the product
        default: '' // Default value is an empty string if not provided
    },
    subCatId: {
        type: String, // Subcategory ID of the product
        default: '' // Default value is an empty string if not provided
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
        ref: 'Category', // Reference model name
        required: true // Field is required
    },
    subCat: {
        type: String, // Subcategory name of the product
        default: '' // Default value is an empty string if not provided
    },
    countInStock: {
        type: Number, // Quantity of the product available in stock
        required: true // Field is required
    },
    rating: {
        type: Number, // Rating of the product
        default: 0 // Default value is 0 if not provided
    },
    isFeatured: {
        type: Boolean, // Indicates if the product is featured
        default: false // Default value is false if not provided
    },
    discount: {
        type: Number, // Discount applied to the product
        required: true // Field is required
    },
    productRam: [
        {
            type: String, // Array of RAM options for the product
            default: null // Default value is null if not provided
        }
    ],
    size: [
        {
            type: String, // Array of size options for the product
            default: null // Default value is null if not provided
        }
    ],
    productWeight: [
        {
            type: String, // Array of weight options for the product
            default: null // Default value is null if not provided
        }
    ],
    dateCreated: {
        type: Date, // Date when the product was recently viewed
        default: Date.now // Default value is the current date and time
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
recentlyViewdSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
recentlyViewdSchema.set('toJSON', {
    virtuals: true,
});

// Export the RecentlyViewd model
exports.RecentlyViewd = mongoose.model('RecentlyViewd', recentlyViewdSchema);
