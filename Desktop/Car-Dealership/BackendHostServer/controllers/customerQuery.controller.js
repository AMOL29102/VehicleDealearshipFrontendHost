const db = require("../models/database");

async function handleGetQuery(req, res) {
    try {
        const enquiry = await db.query(`SELECT * FROM customerQuery`);
        const custEnquiry = enquiry.rows; 
        // console.log("get function "+custEnquiry);
       // Fetching the count of enquiries
       const countResult = await db.query(`SELECT COUNT(*) AS total_count FROM customerQuery`);
       const totalCount = countResult.rows[0].total_count;

       // Sending the response with both the data and the count
       res.json({ enquiries: custEnquiry, totalCount });
    } catch (error) {
        console.log(`Error occurred while fetching customer queries: ${error}`);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

async function handleNewCustomerQuery(req, res) {
    try {
        const { custName, custContact, custQuery, date } = req.body;
        // console.log(custName, custContact, custQuery,"Date : " + date);
        const query = `INSERT INTO customerQuery (custName, custContact, custQuery, enquirydate) VALUES ($1, $2, $3, $4)`;
        const values = [custName, custContact, custQuery, date];

        await db.query(query, values); 
        res.status(201).send("Customer query added"); 

    } catch (error) {
        console.log(`Error occurred while adding customer query: ${error}`);
        
        if (error.code === '23505') { 
            res.status(400).json({ message: 'Duplicate entry. Customer query already exists.' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }
}

async function handleDeleteCustomerQuery(req, res) {
    const { serialnum, custcontact } = req.body;

    try {
        await db.query(`DELETE FROM customerQuery WHERE serialnum = $1 AND custcontact = $2`, [serialnum, custcontact]);
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




module.exports = {
    handleGetQuery,
    handleNewCustomerQuery,
    handleDeleteCustomerQuery 
};