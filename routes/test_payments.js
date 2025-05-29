const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("../db");
const router = express.Router();

// ✅ Make a Payment (POST /api/payments)
router.post("/", async (req, res) => {
    try {
        const { amount, currency, source, user_id } = req.body;

        const payment = await stripe.charges.create({
            amount: amount * 100, // Convert to cents
            currency,
            source,
            description: "Room booking payment",
        });

        const result = await pool.query(
            `INSERT INTO payments (user_id, amount, currency, status) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, amount, currency, payment.status]
        );

        res.json({ message: "Payment successful", payment: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
