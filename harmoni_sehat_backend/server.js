require('dotenv').config();

const checkEnvVariables = () => {
    const requiredEnv = [
        'MONGO_URI',
        'JWT_SECRET',
        'SESSION_SECRET',
        'ENCRYPTION_KEY',
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASS',
        'EMAIL_FROM',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
    ];

    let missing = [];
    for (const envVar of requiredEnv) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        console.error(`FATAL ERROR: Missing environment variables: ${missing.join(', ')}. Please check your .env file.`);
        process.exit(1);
    }
};

checkEnvVariables();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const cors = require('cors');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');
const pasienRoutes = require('./routes/pasienRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Session middleware for Passport
app.use(session({
    secret: process.env.SESSION_SECRET, // Use a strong secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
require('./config/passport-setup');

// Define Routes
app.use('/api/pasiens', pasienRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Not Found Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;