const { body } = require('express-validator');

const createDetailResepValidation = [
  body('resep_id').isInt().withMessage('Resep ID must be an integer'),
  body('obat_id').isInt().withMessage('Obat ID must be an integer'),
  body('dosis').optional().isString().withMessage('Dosis must be a string'),
  body('jumlah').isInt().withMessage('Jumlah must be an integer'),
  body('aturan_pakai').optional().isString().withMessage('Aturan pakai must be a string'),
  body('harga_satuan').optional().isFloat().withMessage('Harga satuan must be a float'),
  body('subtotal').optional().isFloat().withMessage('Subtotal must be a float'),
];

const updateDetailResepValidation = [
  body('resep_id').optional().isInt().withMessage('Resep ID must be an integer'),
  body('obat_id').optional().isInt().withMessage('Obat ID must be an integer'),
  body('dosis').optional().isString().withMessage('Dosis must be a string'),
  body('jumlah').optional().isInt().withMessage('Jumlah must be an integer'),
  body('aturan_pakai').optional().isString().withMessage('Aturan pakai must be a string'),
  body('harga_satuan').optional().isFloat().withMessage('Harga satuan must be a float'),
  body('subtotal').optional().isFloat().withMessage('Subtotal must be a float'),
];

module.exports = {
  createDetailResepValidation,
  updateDetailResepValidation,
};
