
const { uploadToS3 } = require('../amazonS3/s3config'); // Import S3 upload function

async function handleImageUpload(req, res) {
    const carNumber = req.body.carNumber;

    if (!req.files) {
        return res.status(400).send("No files uploaded");
    }

    try {
        // Define the folder name for the car
        const folderName = `${carNumber}/InventoryVehicleImages/`;

        // Upload the display image if provided
        const displayImageUrl = req.files['displayImage'] 
            ? await uploadToS3(req.files['displayImage'][0].buffer, `${folderName}0`, req.files['displayImage'][0].mimetype) // Use '0' for display image
            : null;

        console.log("Display Image URL: " + displayImageUrl);

        // Upload other images if provided
        const otherImageUrls = req.files['images[]'] 
            ? await Promise.all(req.files['images[]'].map((file, index) => 
                uploadToS3(file.buffer, `${folderName}${index + 1}`, file.mimetype) // Use sequential names starting from '1'
            )) 
            : [];

        console.log("Other Images URLs: " + otherImageUrls);


        res.send("Images uploaded successfully");
    } catch (error) {
        console.log(`${error} : Error occurred while uploading the file`);
        res.status(500).send("An error occurred during the file upload");
    }
}

module.exports = handleImageUpload;
