const db = require("../models/database");

async function addInstallments(req,res){
    const {registernumber, amount, installmentdate, } = req.body;
    try {
        const sellingPriceResponse = await db.query(
            `SELECT selling_price FROM soldcardetails WHERE registernumber = $1`,
            [registernumber]
        );

        if (sellingPriceResponse.rows.length === 0) {
            return res.status(404).json({ message: "Car not found" });
        }

        const selling_price = sellingPriceResponse.rows[0].selling_price;

        // Insert the new installment
        const insertResponse = await db.query(
            `INSERT INTO installments (registernumber, amount, installment_date, selling_price)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [registernumber, amount, installmentdate, selling_price]
        );

        const installmentId = insertResponse.rows[0].id;

        // Update the total_amount for this registernumber
        await db.query(
            `UPDATE installments
             SET total_amount = total_amount + $1
             WHERE registernumber = $2`,
            [amount, registernumber]
        );

        res.status(200).json({ message: "Installment added successfully", installmentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add installment", error: error.message });
    }
}
const getInstallments = async (req, res) => {
    const { registernumber } = req.query;;
    console.log(registernumber)
    try {
        const installmentsResponse = await db.query(
            `SELECT * FROM installments WHERE registernumber = $1`,
            [registernumber]
        );

        // if (installmentsResponse.rows.length === 0) {
        //     return res.status(404).json({ message: "No installments found for this car" });
        // }

        res.status(200).json(installmentsResponse.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve installments", error: error.message });
    }
};

// Export the controllers
module.exports = {
    addInstallments,
    getInstallments
};