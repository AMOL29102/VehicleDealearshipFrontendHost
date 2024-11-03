const db = require("../models/database");

async function handleCarDetails(req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({ error: "Request body is empty" });
    }

    const {
      registernumber,
      vehicleName,
      brandName,
      insuranceCompany,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerAddress,
      vehicleColor,
      vehicleBuyPrice,
      vehicleSellPrice,
      vehicleType,
      fuel,
      insuranceNumber,
      insuranceTenure,
      insuranceStartDate,
      insuranceEndDate,
      showInsuranceFields,
      showOwnerFields,
      soldStatus
    } = req.body;

    // Validate mandatory fields
    const requiredFields = {
      registernumber,
      vehicleName,
      brandName,
      vehicleColor,
      vehicleBuyPrice,
      vehicleType,
    };



    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.toString().trim() === "") {
        return res.status(400).send({ error: `${field} is required and cannot be empty` });
      }
    }

    // Ensure carPrice is a positive number
    if (vehicleBuyPrice <= 0 ) {
      return res.status(400).send({ error: "Car price must be a positive number" });
    }

    // Validate specific formats if needed
    if (showOwnerFields && ownerPhone && !/^\d{10}$/.test(ownerPhone)) {
      return res.status(400).send({ error: "Owner phone must be a valid 10-digit number" });
    }

    if (showOwnerFields && ownerEmail&& !/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(ownerEmail)) {
      return res.status(400).send({ error: "Owner email is invalid" });
    }

    // Check if registration number already exists
    const query = `SELECT * FROM cardetails WHERE registernumber = $1`;
    const values = [registernumber];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      return res.status(400).send({ error: "Registration number already exists. Please enter a unique registration number." });
    }

    // Insert car details
    const query2 = `INSERT INTO cardetails (registernumber, carname, carmake, carcompany, carcolor, vehiclebuyprice, fuel,vehiclesellprice) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values2 = [registernumber, vehicleName, vehicleType, brandName, vehicleColor, vehicleBuyPrice, fuel,vehicleSellPrice];
    await db.query(query2, values2);

    if (showInsuranceFields == true) {
      // Insert insurance details
      const query3 = `
      INSERT INTO carinsurance (
        registernum, 
        insurancecompany, 
        insurancenumber, 
        insurancetenure, 
        insurancestartdate, 
        insuranceenddate, 
        soldstatus
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`;
      const values3 = [
        registernumber,
        insuranceCompany,
        insuranceNumber,
        insuranceTenure,
        insuranceStartDate,
        insuranceEndDate, 
        soldStatus || false, // set default soldStatus to false if not provided
      ];



      await db.query(query3, values3);
    }

    // Insert owner details
    const query4 = `INSERT INTO ownerdetails (ownername, ownerphone, owneremail, owneraddress, registernumber) VALUES ($1, $2, $3, $4, $5)`;

    let values4;
    if (showOwnerFields == true) {

      
       values4 = [ownerName, ownerPhone, ownerEmail, ownerAddress, registernumber];
    }
    else
    {
      values4 = ["Nikhil Motors","7058600679","nikhilmotors@gmail.com","Halondi, Kolhapur",registernumber];
    }
    
    await db.query(query4, values4);
    res.status(200).send("Details entered into the database successfully");
  } catch (error) {
    // Log error for debugging
    console.error(`Error: ${error.message}`);

    // Send a generic error message to the frontend
    res.status(500).send({ error: "An error occurred while saving details" });
  }
}

module.exports = handleCarDetails;
