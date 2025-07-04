require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./api');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');

const app = express();

// Konfigurasi CORS yang lebih aman
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Ganti dengan URL frontend Anda
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRouter);

// Handle 404 - Rute tidak ditemukan
app.use((req, res, next) => {
  next(new ApiError(404, 'Rute tidak ditemukan'));
});

// Error handler terpusat
app.use(errorHandler);

module.exports = app;
