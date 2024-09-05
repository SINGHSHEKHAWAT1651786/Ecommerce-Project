// Import the Cloudinary library and get the v2 API
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your cloud name, API key, and API secret
const upload = cloudinary.config({
    // Cloud name obtained from Cloudinary dashboard
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    // API key for accessing Cloudinary services
    api_key: process.env.cloudinary_Config_api_key,
    // API secret for accessing Cloudinary services
    api_secret: process.env.cloudinary_Config_api_secret,
    // Use secure connection (HTTPS)
    secure: true
});

// Export the configured Cloudinary instance for use in other parts of the application
module.exports = upload;
