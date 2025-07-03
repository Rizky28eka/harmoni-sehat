// controllers/dataKesehatanController.js
const DataKesehatan = require('../models/DataKesehatan');

// @desc    Mendapatkan semua data kesehatan
// @route   GET /api/data
exports.getDataKesehatan = async (req, res) => {
  try {
    const data = await DataKesehatan.find().sort({ tanggal: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Membuat data kesehatan baru
// @route   POST /api/data
exports.createDataKesehatan = async (req, res) => {
  try {
    const { nama, detakJantung, suhuTubuh } = req.body;
    const newData = new DataKesehatan({ nama, detakJantung, suhuTubuh });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: 'Input tidak valid', error });
  }
};
