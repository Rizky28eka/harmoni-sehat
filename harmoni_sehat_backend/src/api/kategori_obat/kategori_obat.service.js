const knex = require('../../config/db');

const getAllKategoriObat = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('kategori_obat').select('*');

  if (search) {
    query.where('nama_kategori', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('kategori_obat').count('kategori_id as total').first();

  return { data, total: total.total, page, limit };
};

const getKategoriObatById = async (id) => {
  return knex('kategori_obat').where('kategori_id', id).first();
};

const createKategoriObat = async (kategoriObatData) => {
  return knex('kategori_obat').insert(kategoriObatData).returning('*');
};

const updateKategoriObat = async (id, kategoriObatData) => {
  return knex('kategori_obat').where('kategori_id', id).update(kategoriObatData).returning('*');
};

const deleteKategoriObat = async (id) => {
  return knex('kategori_obat').where('kategori_id', id).del();
};

module.exports = {
  getAllKategoriObat,
  getKategoriObatById,
  createKategoriObat,
  updateKategoriObat,
  deleteKategoriObat,
};
