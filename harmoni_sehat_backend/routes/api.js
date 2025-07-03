// routes/api.js
const express = require('express');
const router = express.Router();
const {
  getDataKesehatan,
  createDataKesehatan,
} = require('../controllers/dataKesehatanController');

router.route('/data').get(getDataKesehatan).post(createDataKesehatan);

module.exports = router;
