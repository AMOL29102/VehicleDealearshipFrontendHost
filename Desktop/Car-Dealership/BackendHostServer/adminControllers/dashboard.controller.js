const db = require("../models/database");

async function handleDashboard(req, res) {
    const { carSearch } = req.query;
    try {
        let query = `
            SELECT o.ownername, o.owneremail, o.ownerphone, c.carmake, c.carname, c.registernumber, c.status 
            FROM cardetails c
            JOIN ownerdetails o ON o.registernumber = c.registernumber
            WHERE 1=1
        `;

        // Add condition for carSearch to check both carname and registernumber (case-insensitive)
        const values = [];
        if (carSearch) {
            query += ` AND (LOWER(c.carname) LIKE $1 OR LOWER(c.registernumber) LIKE $2)`;
            values.push(`%${carSearch.toLowerCase()}%`, `%${carSearch.toLowerCase()}%`);
        }

        const result = await db.query(query, values);
        const carDetails = result.rows.map(row => ({
            status: row.status,
            ownername: row.ownername,
            owneremail: row.owneremail,
            ownerphone: row.ownerphone,
            carmake: row.carmake,
            carname: row.carname,
            registernumber: row.registernumber
        }));
        
        res.send(carDetails);
    } catch (error) {
        console.error("Error occurred while loading car details:", error);
        return res.status(500).send("Error occurred while loading the page");
    }
}

module.exports = handleDashboard;
