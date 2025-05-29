const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const router = express.Router();

// ✅ Register a User (POST /api/users/signup)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: "Name, email, username, and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, username, hashedPassword]
        );

        res.status(201).json({ message: "User registered", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ Login a User (POST /api/users/login)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "Login successful",
            user_id: user.id, // ✅ Add User ID here
            username: user.username, // ✅ Optional: Send username too
            token: token
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
