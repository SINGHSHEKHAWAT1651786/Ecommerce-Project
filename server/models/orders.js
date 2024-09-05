const mongoose = require('mongoose');

// Define the schema for customer orders
const ordersSchema = mongoose.Schema({
    name: {
        type: String, // Customer's name
        required: true // This field is mandatory
    },
    phoneNumber: {
        type: String, // Customer's phone number
        required: true // This field is mandatory
    },
    address: {
        type: String, // Customer's delivery address
        required: true // This field is mandatory
    },
    pincode: {
        type: String, // Postal code for the delivery address
        required: true // This field is mandatory
    },
    amount: {
        type: String, // Total amount for the order
        required: true // This field is mandatory
    },
    paymentId: {
        type: String, // Payment identifier from the payment gateway
        required: true // This field is mandatory
    },
    email: {
        type: String, // Customer's email address
        required: true // This field is mandatory
    },
    userid: {
        type: String, // Unique identifier for the user placing the order
        required: true // This field is mandatory
    },
    products: [
        {
            productId: {
                type: String // Unique identifier for the product
            },
            productTitle: {
                type: String // Title of the product
            },
            quantity: {
                type: Number // Quantity of the product ordered
            },
            price: {
                type: Number // Price of the product
            },
            image: {
                type: String // URL of the product image
            },
            subTotal: {
                type: Number // Subtotal for this particular product
            }
        }
    ],
    status: {
        type: String, // Status of the order (e.g., pending, completed)
        default: "pending" // Default value is "pending"
    },
    date: {
        type: Date, // Date when the order was placed
        default: Date.now // Default value is the current date and time
    }
});

// Add a virtual property 'id' that returns the document's _id as a string
ordersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
ordersSchema.set('toJSON', {
    virtuals: true,
});

// Export the Orders model and schema
exports.Orders = mongoose.model('Orders', ordersSchema);
exports.ordersSchema = ordersSchema;
