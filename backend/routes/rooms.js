const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Search Rooms (GET /api/rooms?search=query)
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        const query = search
            ? `SELECT * FROM rooms WHERE name ILIKE $1 OR type ILIKE $1`
            : `SELECT * FROM rooms`;
        const result = await pool.query(query, search ? [`%${search}%`] : []);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Book a Room (POST /api/rooms/book)
router.post("/book", async (req, res) => {
    try {
        const { user_id, room_id, check_in, check_out } = req.body;
        const result = await pool.query(
            `INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, room_id, check_in, check_out]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// ✅ Get Available Rooms (GET /api/rooms/available)
router.get("/available", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM rooms WHERE availability = 'Available'");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        res.status(500).json({ message: "Failed to retrieve available rooms" });
    }
});


module.exports = router;
