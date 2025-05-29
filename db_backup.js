const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'roomlink_hostel',
    password: '7212Fm',
    port: 5432, // Default PostgreSQL port
});

module.exports = pool;
