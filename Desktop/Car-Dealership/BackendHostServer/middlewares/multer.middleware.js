// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Create a temporary directory if it doesn't exist
// const tempDir = path.join(__dirname, 'temp');
// if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir);
// }

// // Set up Multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, tempDir); // Use the temp directory for uploads
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname); // Keep the original file name
//     }
// });

// // Initialize Multer with the defined storage
// const upload = multer({ storage });

// // Export the upload middleware
// module.exports = upload;

const multer = require("multer");

// Set up Multer storage in memory for serverless
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Export the upload middleware
module.exports = upload;
