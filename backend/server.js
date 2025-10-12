const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const campaignRoutes = require('./routes/campaigns');
const dbModule = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/campaigns', campaignRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Campaign Tracker API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Campaign Tracker API is running' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Decide whether to perform a DB connectivity check on startup.
    // If `USE_IN_MEMORY=true` or we're in a non-production environment, skip the check
    // because the app will use the in-memory fallback. This avoids noisy ECONNREFUSED
    // logs when developers intentionally don't run MySQL locally.
    const pool = dbModule.pool;
    const useInMemory = (process.env.USE_IN_MEMORY === 'true') || (process.env.NODE_ENV !== 'production');

    if (useInMemory) {
        console.log('Running with in-memory fallback (USE_IN_MEMORY=true or non-production). Skipping DB connectivity check.');
        console.log('To enable a real database, start MySQL and set DB_* variables in backend/.env or set USE_IN_MEMORY=false');
    } else {
        pool.execute('SELECT 1')
            .then(() => console.log('Database connection successful'))
            .catch((err) => {
                console.error('Database connection failed on startup:', err && err.code ? { code: err.code, message: err.message } : err);
                console.error('If you do not have a local MySQL server running, either start it or update .env DB_* variables to point to a running instance. For development, the API will fall back to an empty dataset for read operations.');
            });
    }

    setInterval(() => {
        /* noop to keep event loop busy */
    }, 1e7);
});
