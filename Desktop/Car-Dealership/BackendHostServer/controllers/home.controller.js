
const db = require("../models/database");
const { getObjectURL } = require("../amazonS3/s3config"); 

async function handleHomePage(req, res) {
    const { fuelType, carMake, carSearch } = req.query; // Extract parameters from query
    try {
        let query1 = `
        SELECT c.carname, c.registernumber, c.carcolor, c.vehiclebuyprice,c.vehiclesellprice, c.status
        FROM cardetails c 
        WHERE 1=1
        `;

        // Add condition for fuelType
        if (fuelType) {
            query1 += ` AND c.fuel = '${fuelType}'`;
        }

        // Add condition for carMake
        if (carMake) {
            query1 += ` AND c.carmake = '${carMake}'`;
        }

        // Add condition for carSearch to check both carname and registernumber
        if (carSearch) {
            query1 += ` AND (LOWER(c.carname) LIKE LOWER('%${carSearch}%') OR LOWER(c.registernumber) LIKE LOWER('%${carSearch}%'))`;
        }

        query1 += ` ORDER BY c.registernumber`;

        const result = await db.query(query1);

        // Create an array of promises for getting signed URLs
        const carsWithImagesPromises = result.rows.map(async (row) => {
            const carNumber = row.registernumber; // Get the car number from the row
            const displayImageKey = `${carNumber}/InventoryVehicleImages/0`; // Generate key for display image

            // Generate signed URL for display image
            const displayImageUrl = await getObjectURL(displayImageKey);
            console.log(`Display Image URL: ${displayImageUrl}`);


            return {
                registernumber: row.registernumber,
                carname: row.carname,
                carprice: row.vehiclesellprice,
                status: row.status,
                displayImage: displayImageUrl,

            };
        });

        // Wait for all promises to resolve
        const carsWithImages = await Promise.all(carsWithImagesPromises);

        res.json({
            carsWithImages
        });

    } catch (error) {
        console.log(`${error} : Error occurred while loading images`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = handleHomePage;
