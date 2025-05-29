const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db"); // ✅ Connects to PostgreSQL

dotenv.config(); // ✅ Loads environment variables

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Import API route files
const roomsRoutes = require("./routes/rooms"); 
const usersRoutes = require("./routes/users"); 
const bookingsRoutes = require("./routes/bookings");
const paymentsRoutes = require("./routes/payments");

// ✅ Use API routes
app.use("/api/rooms", roomsRoutes); 
app.use("/api/users", usersRoutes); 
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);

// ✅ Endpoint to get the latest booking for a user
app.get("/api/bookings/latest", async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        return res.status(400).json({ message: "User ID required" });
    }

    try {
        const result = await pool.query(
            "SELECT id FROM bookings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
            [user_id]
        );

        if (result.rows.length > 0) {
            res.json({ id: result.rows[0].id });
        } else {
            res.json({ message: "No booking found" });
        }
    } catch (error) {
        console.error("Error fetching latest booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Endpoint to create a new booking for a user if none exists
app.post("/api/bookings/new", async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID required" });
    }

    try {
        // ✅ Create a default booking with random room & dates
        const result = await pool.query(
            "INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date) VALUES ($1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days') RETURNING id",
            [user_id]
        );

        res.json({ id: result.rows[0].id, message: "New booking created!" });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Failed to create booking" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Test database connection
pool.query("SELECT * FROM rooms", (err, res) => {
  if (err) console.error("Error executing query:", err);
  else console.log("Rooms data:", res.rows);
});
