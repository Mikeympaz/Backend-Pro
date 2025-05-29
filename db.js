require("dotenv").config(); // Load environment variables
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Uses DATABASE_URL from .env
  ssl: false  // Needed for cloud databases, not local
});

module.exports = pool;
