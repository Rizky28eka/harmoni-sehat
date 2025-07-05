const knex = require('../../config/db');

const getAllKurir = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('kurir').select('*');

  if (search) {
    query.where('nama_kurir', 'like', `%${search}%`)
         .orWhere('no_telepon', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('kurir').count('kurir_id as total').first();

  return { data, total: total.total, page, limit };
};

const getKurirById = async (id) => {
  return knex('kurir').where('kurir_id', id).first();
};

const createKurir = async (kurirData) => {
  return knex('kurir').insert(kurirData).returning('*');
};

const updateKurir = async (id, kurirData) => {
  return knex('kurir').where('kurir_id', id).update(kurirData).returning('*');
};

const deleteKurir = async (id) => {
  return knex('kurir').where('kurir_id', id).del();
};

module.exports = {
  getAllKurir,
  getKurirById,
  createKurir,
  updateKurir,
  deleteKurir,
};
