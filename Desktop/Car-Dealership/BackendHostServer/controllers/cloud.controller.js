// const cloudinary = require("cloudinary").v2; // Correct the import statement
// const fs = require("fs");
// require('dotenv').config(); 

// // Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Function to upload an image to Cloudinary
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         console.log({
//             cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//             api_key: process.env.CLOUDINARY_API_KEY,
//             api_secret: process.env.CLOUDINARY_API_SECRET
//         });
        
//         // Uploading the file to Cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto", // Automatically detect resource type
//         });

//         // Log success and return the response
//         console.log("File uploaded successfully:", response.url);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         return response;

//     } catch (error) {
//         console.error("Error uploading to Cloudinary:", error);

//         // Attempt to delete the local file if it exists
        

//         return null;
//     }
// };

// module.exports = uploadOnCloudinary;

// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");
// require("dotenv").config();

// // Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Function to upload an image buffer to Cloudinary
// const uploadOnCloudinary = async (buffer) => {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             { resource_type: "auto" },
//             (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result);
//             }
//         );
//         streamifier.createReadStream(buffer).pipe(uploadStream);
//     });
// };

// module.exports = uploadOnCloudinary;


const { uploadToS3 } = require("../amazonS3/s3config");

const uploadOnS3 = async (buffer, filename, filetype) => {
    try {
        // Upload the buffer to S3
        const s3Url = await uploadToS3(buffer, filename, filetype);
        return s3Url;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Image upload to S3 failed");
    }
};

module.exports = uploadOnS3;
