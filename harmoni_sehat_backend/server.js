require('dotenv').config();
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
    secret: process.env.SESSION_SECRET || 'your-session-secret', // Use a strong secret from .env
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));