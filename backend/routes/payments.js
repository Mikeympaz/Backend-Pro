const express = require("express");
const pool = require("../db"); // ✅ Connect to PostgreSQL
const crypto = require("crypto"); // ✅ Required for generating unique Transaction IDs

const router = express.Router();

// ✅ Save Payment Confirmation with Auto-generated Transaction ID
router.post("/", async (req, res) => {
    try {
        const { user_id, booking_id, amount } = req.body;

        // Ensure all required fields are provided
        if (!user_id || !booking_id || !amount) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const transaction_id = crypto.randomUUID(); // ✅ Generate unique Transaction ID

        // Insert payment confirmation into the database
        const result = await pool.query(
            `INSERT INTO payments (user_id, booking_id, transaction_id, amount, payment_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, booking_id, transaction_id, amount, new Date(), "pending"]
        );
        res.json({ 
            message: "Payment confirmation received", 
            transaction_id: result.rows[0].transaction_id, // ✅ Ensure this is sent
            payment: result.rows[0]
        });
        
        
    } catch (error) {
        console.error("Error inserting payment:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
