import axios from "axios"; // Importing Axios for making HTTP requests

// Retrieve the token from local storage
const token = localStorage.getItem("token");

// Configuration for HTTP requests, including headers
const params = {
    headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header for authenticated requests
        'Content-Type': 'application/json', // Set content type to JSON
    },
};

// Function to fetch data from the API
export const fetchDataFromApi = async (url) => {
    try {
        // Make a GET request to the specified URL with configured headers
        const { data } = await axios.get(process.env.REACT_APP_API_URL + url, params);
        return data; // Return the response data
    } catch (error) {
        console.log(error); // Log any errors encountered
        return error; // Return the error
    }
};

// Function to post data to the API
export const postData = async (url, formData) => {
    try {
        // Make a POST request to the specified URL with formData and headers
        const response = await fetch(process.env.REACT_APP_API_URL + url, {
            method: 'POST', // Set HTTP method to POST
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify(formData) // Convert formData to JSON
        });

        if (response.ok) {
            // If response is OK, parse and return JSON data
            const data = await response.json();
            return data;
        } else {
            // If response is not OK, parse and return error data
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.error('Error:', error); // Log any errors encountered
    }
};

// Function to update data on the API
export const editData = async (url, updatedData) => {
    // Make a PUT request to the specified URL with updatedData and configured headers
    const { res } = await axios.put(`${process.env.REACT_APP_API_URL}${url}`, updatedData, params);
    return res; // Return the response
};

// Function to delete data from the API
export const deleteData = async (url) => {
    // Make a DELETE request to the specified URL with configured headers
    const { res } = await axios.delete(`${process.env.REACT_APP_API_URL}${url}`, params);
    return res; // Return the response
};

// Function to upload an image to the API
export const uploadImage = async (url, formData) => {
    // Make a POST request to the specified URL with formData
    const { res } = await axios.post(process.env.REACT_APP_API_URL + url, formData);
    return res; // Return the response
};

// Function to delete images from the API
export const deleteImages = async (url, image) => {
    // Make a DELETE request to the specified URL with image data and configured headers
    const { res } = await axios.delete(`${process.env.REACT_APP_API_URL}${url}`, params, image);
    return res; // Return the response
};
