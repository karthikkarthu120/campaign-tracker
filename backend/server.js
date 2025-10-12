const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const campaignRoutes = require('./routes/campaigns');
const dbModule = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Global error handlers to surface unexpected issues
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // don't exit; log and continue for debugging in dev
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // don't exit in development; inspect logs
});

// Middleware
// In development allow the frontend to run on a different port. If FRONTEND_URL
// is set, use it; otherwise allow the request origin (true) so dev servers on
// different ports (3000, 3001, etc.) will be accepted.
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/campaigns', campaignRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Campaign Tracker API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
// Use app.all for a catch-all route instead of app.use with '*' which
// can trigger path-to-regexp errors with some express/path-to-regexp versions.
// Use app.use with no path to create a catch-all 404 handler without
// supplying a route string (avoids path-to-regexp parsing issues).
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Test DB connectivity on startup to provide a clearer message if MySQL is down
    // non-blocking DB connectivity check (don't await so errors don't affect startup)
    const pool = dbModule.pool;
    pool.execute('SELECT 1')
        .then(() => console.log('Database connection successful'))
        .catch((err) => {
            console.error('Database connection failed on startup:', err && err.code ? { code: err.code, message: err.message } : err);
            console.error('If you do not have a local MySQL server running, either start it or update .env DB_* variables to point to a running instance. For development, the API will fall back to an empty dataset for read operations.');
        });

    // Keep the process alive even if certain environments would allow it to exit
    // (this prevents unexpected termination in some constrained shells).
    setInterval(() => {
        /* noop to keep event loop busy */
    }, 1e7);
});
