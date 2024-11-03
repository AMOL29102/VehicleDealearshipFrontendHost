
const db = require("../models/database");
const { getObjectURL, listImagesInFolder } = require("../amazonS3/s3config"); 


async function handleSellCar(req, res) {
    try {
        console.log("Request body:", req.body);
        
        
        // Destructure fields from form data in req.body.formData
        const {
            carID,
            sellingPrice,
            ownerName,
            contactNo,
            downPayment,
            totalInstallments,
            installmentAmount,
            commission
        } = req.body;

        console.log("In controller: CarID - " + carID);

        // Update car status to sold in the cardetails table
        const updateQuery = `UPDATE cardetails SET status = true WHERE registernumber = $1`;
        await db.query(updateQuery, [carID]);

        const temp="";

        // Insert data into the soldcardetails table, including the URLs
        await db.query(
            `INSERT INTO soldcardetails (
                registernumber, selling_price, owner_name, contact_no, 
                down_payment, total_installments, installment_amount, commission
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [
                carID,
                sellingPrice,
                ownerName,
                contactNo,
                downPayment,
                totalInstallments,
                installmentAmount,
                commission, 
            ]
        );

        res.status(200).json({ message: 'Car sold successfully!' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function listDocHelper(FolderName)
{
    // Fetch image keys from the S3 folder
    const DocsKeys = await listImagesInFolder(FolderName);

    // Generate signed URLs for other images, starting from 1
    const DocsPromises = DocsKeys.map(async (key, index) => {
        return await getObjectURL(key); // Generate URL for each image key
    });

   // Wait for all other image promises to resolve
    const DocsUrls = await Promise.all(DocsPromises);
    return DocsUrls;
}

async function getSoldCarDetails(req, res) {
    try {
        // If a specific car ID is provided, fetch details for that car only
        const { carID } = req.query;
        
        let query = `SELECT * FROM soldcardetails`;
        const params = [];

        if (carID) {
            query += ` WHERE registernumber = $1`;
            params.push(carID);
        }

        const result = await db.query(query, params);

console.log("sellcar.cotroller : "+carID)
        
        // S3 folder structure for images (e.g., regisNum/VehicleImages/)
        const soldCarImagesFolder = `${carID}/SoldCarImages/`;
        const soldCarInsuranceFolder = `${carID}/InsuranceDocuments/`;

        const soldCarImages= await listDocHelper(soldCarImagesFolder);
        const soldCarInsuranceDocs= await listDocHelper(soldCarInsuranceFolder);


        

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const dbData = result.rows ;

        res.status(200).json({dbData, soldCarImages,soldCarInsuranceDocs});
    } catch (error) {
        console.error("Error fetching sold car details:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}


module.exports = {handleSellCar,getSoldCarDetails};
