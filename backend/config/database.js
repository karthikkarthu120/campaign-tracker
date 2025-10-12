const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const createPool = () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'campaign_tracker',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool.promise();
};

// Export the pool factory and a convenience default pool instance
const pool = createPool();

module.exports = {
    getPool: createPool,
    pool
};
