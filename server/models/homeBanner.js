const mongoose = require('mongoose');

// Define the schema for home banners
const homeBannerSchema = mongoose.Schema({
    images: [
        {
            type: String, // Data type for image URLs associated with the home banner
            required: true // This field is mandatory
        }
    ]
});

// Add a virtual property 'id' that returns the document's _id as a string
homeBannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure that virtual properties are included when converting to JSON
homeBannerSchema.set('toJSON', {
    virtuals: true,
});

// Export the HomeBanner model and schema
exports.HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);
exports.homeBannerSchema = homeBannerSchema;
