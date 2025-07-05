const { body } = require('express-validator');

const createObatValidation = [
  body('nama_obat').notEmpty().withMessage('Nama obat is required').isString().withMessage('Nama obat must be a string'),
  body('nama_generik').optional().isString().withMessage('Nama generik must be a string'),
  body('kategori_obat_id').optional().isInt().withMessage('Kategori obat ID must be an integer'),
  body('bentuk_obat').optional().isIn(['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes']).withMessage('Invalid bentuk obat'),
  body('kandungan').optional().isString().withMessage('Kandungan must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('indikasi').optional().isString().withMessage('Indikasi must be a string'),
  body('kontraindikasi').optional().isString().withMessage('Kontraindikasi must be a string'),
  body('efek_samping').optional().isString().withMessage('Efek samping must be a string'),
  body('dosis_dewasa').optional().isString().withMessage('Dosis dewasa must be a string'),
  body('dosis_anak').optional().isString().withMessage('Dosis anak must be a string'),
  body('cara_penyimpanan').optional().isString().withMessage('Cara penyimpanan must be a string'),
  body('nomor_bpom').optional().isString().withMessage('Nomor BPOM must be a string'),
  body('produsen').optional().isString().withMessage('Produsen must be a string'),
  body('harga').optional().isFloat().withMessage('Harga must be a float'),
  body('foto_obat').optional().isString().withMessage('Foto obat must be a string'),
  body('is_resep_dokter').optional().isBoolean().withMessage('Is_resep_dokter must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

const updateObatValidation = [
  body('nama_obat').optional().notEmpty().withMessage('Nama obat is required').isString().withMessage('Nama obat must be a string'),
  body('nama_generik').optional().isString().withMessage('Nama generik must be a string'),
  body('kategori_obat_id').optional().isInt().withMessage('Kategori obat ID must be an integer'),
  body('bentuk_obat').optional().isIn(['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes']).withMessage('Invalid bentuk obat'),
  body('kandungan').optional().isString().withMessage('Kandungan must be a string'),
  body('deskripsi').optional().isString().withMessage('Deskripsi must be a string'),
  body('indikasi').optional().isString().withMessage('Indikasi must be a string'),
  body('kontraindikasi').optional().isString().withMessage('Kontraindikasi must be a string'),
  body('efek_samping').optional().isString().withMessage('Efek samping must be a string'),
  body('dosis_dewasa').optional().isString().withMessage('Dosis dewasa must be a string'),
  body('dosis_anak').optional().isString().withMessage('Dosis anak must be a string'),
  body('cara_penyimpanan').optional().isString().withMessage('Cara penyimpanan must be a string'),
  body('nomor_bpom').optional().isString().withMessage('Nomor BPOM must be a string'),
  body('produsen').optional().isString().withMessage('Produsen must be a string'),
  body('harga').optional().isFloat().withMessage('Harga must be a float'),
  body('foto_obat').optional().isString().withMessage('Foto obat must be a string'),
  body('is_resep_dokter').optional().isBoolean().withMessage('Is_resep_dokter must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('Is_active must be a boolean'),
];

module.exports = {
  createObatValidation,
  updateObatValidation,
};
