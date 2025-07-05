const { body } = require('express-validator');

const createStokObatValidation = [
  body('obat_id').isInt().withMessage('Obat ID must be an integer'),
  body('apotek_id').isInt().withMessage('Apotek ID must be an integer'),
  body('jumlah_stok').isInt().withMessage('Jumlah stok must be an integer'),
  body('stok_minimum').optional().isInt().withMessage('Stok minimum must be an integer'),
  body('tanggal_kadaluarsa').optional().isISO8601().toDate().withMessage('Invalid tanggal kadaluarsa'),
  body('harga_jual').optional().isFloat().withMessage('Harga jual must be a float'),
  body('is_available').optional().isBoolean().withMessage('Is_available must be a boolean'),
];

const updateStokObatValidation = [
  body('obat_id').optional().isInt().withMessage('Obat ID must be an integer'),
  body('apotek_id').optional().isInt().withMessage('Apotek ID must be an integer'),
  body('jumlah_stok').optional().isInt().withMessage('Jumlah stok must be an integer'),
  body('stok_minimum').optional().isInt().withMessage('Stok minimum must be an integer'),
  body('tanggal_kadaluarsa').optional().isISO8601().toDate().withMessage('Invalid tanggal kadaluarsa'),
  body('harga_jual').optional().isFloat().withMessage('Harga jual must be a float'),
  body('is_available').optional().isBoolean().withMessage('Is_available must be a boolean'),
];

module.exports = {
  createStokObatValidation,
  updateStokObatValidation,
};
