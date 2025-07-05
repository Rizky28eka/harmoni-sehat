const knex = require('../../config/db');

const getAllKategoriArtikel = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('kategori_artikel').select('*');

  if (search) {
    query.where('nama_kategori', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('kategori_artikel').count('kategori_id as total').first();

  return { data, total: total.total, page, limit };
};

const getKategoriArtikelById = async (id) => {
  return knex('kategori_artikel').where('kategori_id', id).first();
};

const createKategoriArtikel = async (kategoriArtikelData) => {
  return knex('kategori_artikel').insert(kategoriArtikelData).returning('*');
};

const updateKategoriArtikel = async (id, kategoriArtikelData) => {
  return knex('kategori_artikel').where('kategori_id', id).update(kategoriArtikelData).returning('*');
};

const deleteKategoriArtikel = async (id) => {
  return knex('kategori_artikel').where('kategori_id', id).del();
};

module.exports = {
  getAllKategoriArtikel,
  getKategoriArtikelById,
  createKategoriArtikel,
  updateKategoriArtikel,
  deleteKategoriArtikel,
};
