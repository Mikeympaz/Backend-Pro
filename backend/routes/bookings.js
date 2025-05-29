const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Create a Booking (POST /api/bookings)
router.post("/", async (req, res) => {
    try {
        console.log("Received Booking Data:", req.body);

        const { user_id, room_id, check_in_date, check_out_date } = req.body;

        // Check if room is available
        const availability = await pool.query(
            "SELECT * FROM bookings WHERE room_id = $1 AND check_out_date > $2 AND check_in_date < $3",
            [room_id, check_in_date, check_out_date]
        );

        if (availability.rows.length > 0) {
            return res.status(400).json({ message: "Room is already booked for those dates." });
        }

        // Insert booking into database
        const result = await pool.query(
            "INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, room_id, check_in_date, check_out_date]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error inserting booking:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ Fetch Latest Booking for a User (GET /api/bookings/latest)
router.get("/latest", async (req, res) => {
    try {
        const { user_id } = req.query;
        const result = await pool.query(
            "SELECT id FROM bookings WHERE user_id = $1 ORDER BY check_in_date DESC LIMIT 1",
            [user_id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // ✅ Sends latest booking ID
        } else {
            res.json({ message: "No booking found" });
        }
    } catch (error) {
        console.error("Error fetching latest booking:", error);
        res.status(500).json({ message: "Failed to retrieve latest booking" });
    }
});

// ✅ Cancel booking (DELETE /api/bookings/:id)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
        res.json({ message: "Booking canceled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
