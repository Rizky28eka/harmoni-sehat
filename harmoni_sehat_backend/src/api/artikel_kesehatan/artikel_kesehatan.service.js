const knex = require('../../config/db');

const getAllArtikelKesehatan = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('artikel_kesehatan')
    .select('artikel_kesehatan.*', 'kategori_artikel.nama_kategori')
    .leftJoin('kategori_artikel', 'artikel_kesehatan.kategori_artikel_id', 'kategori_artikel.kategori_id');

  if (search) {
    query.where('judul', 'like', `%${search}%`)
         .orWhere('penulis', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('artikel_kesehatan').count('artikel_id as total').first();

  return { data, total: total.total, page, limit };
};

const getArtikelKesehatanById = async (id) => {
  return knex('artikel_kesehatan')
    .select('artikel_kesehatan.*', 'kategori_artikel.nama_kategori')
    .leftJoin('kategori_artikel', 'artikel_kesehatan.kategori_artikel_id', 'kategori_artikel.kategori_id')
    .where('artikel_id', id)
    .first();
};

const createArtikelKesehatan = async (artikelKesehatanData) => {
  return knex('artikel_kesehatan').insert(artikelKesehatanData).returning('*');
};

const updateArtikelKesehatan = async (id, artikelKesehatanData) => {
  return knex('artikel_kesehatan').where('artikel_id', id).update(artikelKesehatanData).returning('*');
};

const deleteArtikelKesehatan = async (id) => {
  return knex('artikel_kesehatan').where('artikel_id', id).del();
};

module.exports = {
  getAllArtikelKesehatan,
  getArtikelKesehatanById,
  createArtikelKesehatan,
  updateArtikelKesehatan,
  deleteArtikelKesehatan,
};
