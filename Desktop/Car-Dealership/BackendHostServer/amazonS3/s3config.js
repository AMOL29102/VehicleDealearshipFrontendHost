const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();



// Initialize S3 client with specific configurations
const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY,
        secretAccessKey: process.env.AMAZON_SECRET_KEY,
    }
});

async function uploadToS3(filename, contentType) {
    // Set up the parameters for the S3 upload
    const s3Params = {
        Bucket: "cardealerbucket",
        Key: filename,
        ContentType: contentType
    };

    // Create a PutObjectCommand for the S3 upload
    const command = new PutObjectCommand(s3Params);

    // Generate a pre-signed URL that expires in 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });
    return url;
}


// Generate a signed URL to retrieve an object
async function getObjectURL(key, expiresIn = 3600) { // default expiration set to 1 hour
    const command = new GetObjectCommand({
        Bucket: "cardealerbucket",
        Key: key,
    });
    
    // Generate a signed URL with an expiration time
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
}


    // List images in a specified folder path
    async function listImagesInFolder(path) {
        const params = { 
            Bucket: 'cardealerbucket', // Replace with your bucket name
            Prefix: path, // Use the folder structure based on the provided path
        };

        try {
            const command = new ListObjectsV2Command(params); // Create command
            const data = await s3Client.send(command); // Send command

            // Check if data.Contents exists and has items
            if (!data.Contents || data.Contents.length === 0) {
                console.log(`No images found for path ${path}`);
                return []; // Return an empty array if no images found
            }

            // Extract the keys of the images
            return data.Contents.map(item => item.Key); // Returns an array of keys
        } catch (error) {
            console.error(`Error listing images in folder for path ${path}: ${error.message}`);
            throw error; // Rethrow to handle in the main function
        }
    }


async function  deleteObject(filename) {
    const command = new DeleteObjectCommand({
        Bucket : "cardealerbucket",
        Key : filename
    });

    try {
        await s3Client.send(command);
        console.log("Object deleted successfully");
    } catch (error) {
        res.status(500).send({message : "Internal Server Error"});
    }
    
}

module.exports = { uploadToS3,getObjectURL ,listImagesInFolder,deleteObject};