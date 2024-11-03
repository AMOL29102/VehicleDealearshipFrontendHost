const db = require("../models/database");
const { getObjectURL, listImagesInFolder } = require("../amazonS3/s3config"); // Import S3 functions

async function handleSpecifiPage(req, res) {
    try {
        const regisNum = req.params.registernumber;
        console.log(`Registration Number: ${regisNum}`);
        const values = [regisNum];

        // Query to fetch car details
        const query1 = `SELECT * FROM cardetails WHERE registernumber = $1`;
        const detailsResult = await db.query(query1, values);

        // Query to fetch car insurance details
        const query3 = `SELECT * FROM carinsurance WHERE registernum = $1`;
        const insuranceResults = await db.query(query3, values);

        // Query to fetch owner details
        const query4 = `SELECT * FROM ownerdetails WHERE registernumber = $1`;
        const ownerResults = await db.query(query4, values);

        if (detailsResult.rows.length > 0) {
            const car = detailsResult.rows[0];
            const insurance = insuranceResults.rows[0]; // Assuming one insurance record per car
            const owner = ownerResults.rows[0]; // Assuming one owner record per car

            // S3 folder structure for images (e.g., regisNum/VehicleImages/)
            const imageFolder = `${regisNum}/InventoryVehicleImages/`;

            // Fetch image keys from the S3 folder
            const imageKeys = await listImagesInFolder(imageFolder);
            console.log(`Image Keys for ${regisNum}: ${imageKeys}`);

            // Generate signed URLs for other images, starting from 1
            const imagesPromises = imageKeys.map(async (key, index) => {
                return await getObjectURL(key); // Generate URL for each image key
            });

            // Wait for all other image promises to resolve
            const images = await Promise.all(imagesPromises);


            res.json({ car, images, insurance, owner });
        } else {
            res.status(400).send("Car not found");
        }
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = handleSpecifiPage;
