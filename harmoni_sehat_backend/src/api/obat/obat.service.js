const knex = require('../../config/db');

const getAllObat = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('obat')
    .select('obat.*', 'kategori_obat.nama_kategori')
    .leftJoin('kategori_obat', 'obat.kategori_obat_id', 'kategori_obat.kategori_id');

  if (search) {
    query.where('nama_obat', 'like', `%${search}%`)
         .orWhere('nama_generik', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('obat').count('obat_id as total').first();

  return { data, total: total.total, page, limit };
};

const getObatById = async (id) => {
  return knex('obat')
    .select('obat.*', 'kategori_obat.nama_kategori')
    .leftJoin('kategori_obat', 'obat.kategori_obat_id', 'kategori_obat.kategori_id')
    .where('obat_id', id)
    .first();
};

const createObat = async (obatData) => {
  return knex('obat').insert(obatData).returning('*');
};

const updateObat = async (id, obatData) => {
  return knex('obat').where('obat_id', id).update(obatData).returning('*');
};

const deleteObat = async (id) => {
  return knex('obat').where('obat_id', id).del();
};

module.exports = {
  getAllObat,
  getObatById,
  createObat,
  updateObat,
  deleteObat,
};
