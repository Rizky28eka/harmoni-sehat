const knex = require('../../config/db');

const getAllProvinsi = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('provinsi').select('*');

  if (search) {
    query.where('nama_provinsi', 'like', `%${search}%`)
         .orWhere('kode_provinsi', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('provinsi').count('provinsi_id as total').first();

  return { data, total: total.total, page, limit };
};

const getProvinsiById = async (id) => {
  return knex('provinsi').where('provinsi_id', id).first();
};

const createProvinsi = async (provinsiData) => {
  return knex('provinsi').insert(provinsiData).returning('*');
};

const updateProvinsi = async (id, provinsiData) => {
  return knex('provinsi').where('provinsi_id', id).update(provinsiData).returning('*');
};

const deleteProvinsi = async (id) => {
  return knex('provinsi').where('provinsi_id', id).del();
};

// Relational endpoints
const getProvinsiKota = async (provinsiId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('kota')
    .select('*')
    .where('provinsi_id', provinsiId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('kota').where('provinsi_id', provinsiId).count('kota_id as total').first();

  return { data, total: total.total, page, limit };
};

module.exports = {
  getAllProvinsi,
  getProvinsiById,
  createProvinsi,
  updateProvinsi,
  deleteProvinsi,
  getProvinsiKota,
};