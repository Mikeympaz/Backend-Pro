const pool = require('./db'); // Make sure 'db.js' is correctly set up

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Database Error:", err);
  else console.log("Database Connected, Time:", res.rows[0]);
});
