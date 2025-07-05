
const knex = require('../../config/db');

const getAllSpesialisasi = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('spesialisasi').select('*');

  if (search) {
    query.where('nama_spesialisasi', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('spesialisasi').count('spesialisasi_id as total').first();

  return { data, total: total.total, page, limit };
};

const getSpesialisasiById = async (id) => {
  return knex('spesialisasi').where('spesialisasi_id', id).first();
};

const createSpesialisasi = async (data) => {
  return knex('spesialisasi').insert(data).returning('*');
};

const updateSpesialisasi = async (id, data) => {
  return knex('spesialisasi').where('spesialisasi_id', id).update(data).returning('*');
};

const deleteSpesialisasi = async (id) => {
  return knex('spesialisasi').where('spesialisasi_id', id).del();
};

module.exports = {
  getAllSpesialisasi,
  getSpesialisasiById,
  createSpesialisasi,
  updateSpesialisasi,
  deleteSpesialisasi,
};
