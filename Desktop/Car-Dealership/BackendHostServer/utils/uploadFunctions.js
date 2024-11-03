const cloudin = require("../controllers/cloud.controller");
const { uploadToS3 } = require("../amazonS3/s3config");

// async function imageUpload(registerNumber, files) {
//     const imageUrls = [];
//     try {
//         // Loop through each file and upload to Cloudinary
//         for (const file of files) {
           
//             const result = await cloudin(file.buffer);
//             const imageUrl = result.secure_url;
//             imageUrls.push(imageUrl);   
//         }
//         return imageUrls;
//     } catch (error) {
//         console.error(`Error uploading images for ${registerNumber}:`, error);
//         throw new Error('Image upload failed');
//     }
// }


async function imageUpload(registerNumber, files) {
    const imageUrls = [];
    try {
        // Loop through each file and upload to S3
        for (const file of files) {
            const { buffer, originalname, mimetype } = file;
            const s3Url = await uploadToS3(buffer, originalname, mimetype);
            imageUrls.push(s3Url);
        }
        return imageUrls;
    } catch (error) {
        console.error(`Error uploading images for ${registerNumber}:`, error);
        throw new Error("Image upload failed");
    }
}


async function documentUpload(registerNumber, files) {
    const documentUrls = [];
    try {
        // Loop through each document and upload to Cloudinary
        for (const doc of files) {
            const filepath = doc.path;
            const result = await cloudin(filepath); // Upload document to Cloudinary
            const docUrl = result.secure_url;
            documentUrls.push(docUrl); // Store secure URLs
        }
        return documentUrls;
    } catch (error) {
        console.error(`Error uploading documents for ${registerNumber}:`, error);
        throw new Error('Document upload failed');
    }
}

module.exports = {
    imageUpload,
    documentUpload
};