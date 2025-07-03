// routes/api.js
const express = require('express');
const router = express.Router();
const {
  getAllData,
  createData,
} = require('../controllers/dataKesehatanController');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Rute untuk mendapatkan semua data dan membuat data baru
// Contoh penerapan middleware:
// GET /api/kesehatan hanya bisa diakses oleh role 'pasien' yang sudah login.
// POST /api/kesehatan bisa diakses oleh siapa saja yang sudah login.
router
  .route('/kesehatan')
  .get(authenticate, authorize('pasien'), getAllData)
  .post(authenticate, createData);

module.exports = router;

