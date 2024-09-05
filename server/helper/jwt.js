var { expressjwt: jwt } = require("express-jwt");

// Function to create and configure JWT middleware
function authJwt() {
    // Retrieve the secret key for JWT from environment variables
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    
    // Return the configured JWT middleware
    return jwt({
        // Set the secret key used for signing the JWTs
        secret: secret,
        // Specify the algorithm used for signing the JWTs
        algorithms: ["HS256"],
    });
}

// Export the authJwt function for use in other modules
module.exports = authJwt;
