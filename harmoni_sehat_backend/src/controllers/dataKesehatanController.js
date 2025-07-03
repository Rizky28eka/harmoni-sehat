// controllers/dataKesehatanController.js
// controllers/dataKesehatanController.js
const pool = require('../config/db');

// @desc    Get all data kesehatan
// @route   GET /api/kesehatan
// @access  Public
exports.getAllData = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM data_kesehatan ORDER BY tanggal DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new data kesehatan
// @route   POST /api/kesehatan
// @access  Public
exports.createData = async (req, res) => {
  const { nama, detakJantung, suhuTubuh } = req.body;

  if (!nama || !detakJantung || !suhuTubuh) {
    return res.status(400).json({ msg: 'Harap masukkan semua field' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO data_kesehatan (nama, detakJantung, suhuTubuh) VALUES (?, ?, ?)',
      [nama, detakJantung, suhuTubuh]
    );
    res.status(201).json({
      id: result.insertId,
      nama,
      detakJantung,
      suhuTubuh,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
