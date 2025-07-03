// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser untuk JSON

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Terhubung...'))
  .catch((err) => console.error(err));

// Routes
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
