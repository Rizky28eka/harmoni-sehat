const { body } = require('express-validator');

const createArtikelKesehatanValidation = [
  body('judul').notEmpty().withMessage('Judul is required').isString().withMessage('Judul must be a string'),
  body('slug').notEmpty().withMessage('Slug is required').isString().withMessage('Slug must be a string'),
  body('konten').notEmpty().withMessage('Konten is required').isString().withMessage('Konten must be a string'),
  body('kategori_artikel_id').optional().isInt().withMessage('Kategori artikel ID must be an integer'),
  body('penulis').optional().isString().withMessage('Penulis must be a string'),
  body('gambar_utama').optional().isString().withMessage('Gambar utama must be a string'),
  body('tags').optional().isJSON().withMessage('Tags must be a JSON string'),
  body('meta_description').optional().isString().withMessage('Meta description must be a string'),
  body('views').optional().isInt().withMessage('Views must be an integer'),
  body('likes').optional().isInt().withMessage('Likes must be an integer'),
  body('is_featured').optional().isBoolean().withMessage('Is_featured must be a boolean'),
  body('is_published').optional().isBoolean().withMessage('Is_published must be a boolean'),
  body('tanggal_publish').optional().isISO8601().toDate().withMessage('Invalid tanggal publish'),
];

const updateArtikelKesehatanValidation = [
  body('judul').optional().notEmpty().withMessage('Judul is required').isString().withMessage('Judul must be a string'),
  body('slug').optional().notEmpty().withMessage('Slug is required').isString().withMessage('Slug must be a string'),
  body('konten').optional().notEmpty().withMessage('Konten is required').isString().withMessage('Konten must be a string'),
  body('kategori_artikel_id').optional().isInt().withMessage('Kategori artikel ID must be an integer'),
  body('penulis').optional().isString().withMessage('Penulis must be a string'),
  body('gambar_utama').optional().isString().withMessage('Gambar utama must be a string'),
  body('tags').optional().isJSON().withMessage('Tags must be a JSON string'),
  body('meta_description').optional().isString().withMessage('Meta description must be a string'),
  body('views').optional().isInt().withMessage('Views must be an integer'),
  body('likes').optional().isInt().withMessage('Likes must be an integer'),
  body('is_featured').optional().isBoolean().withMessage('Is_featured must be a boolean'),
  body('is_published').optional().isBoolean().withMessage('Is_published must be a boolean'),
  body('tanggal_publish').optional().isISO8601().toDate().withMessage('Invalid tanggal publish'),
];

module.exports = {
  createArtikelKesehatanValidation,
  updateArtikelKesehatanValidation,
};
