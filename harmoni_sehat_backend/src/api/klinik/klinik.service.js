const knex = require('../../config/db');

const getAllKlinik = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('klinik').select('*');

  if (search) {
    query.where('nama_klinik', 'like', `%${search}%`)
         .orWhere('email', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('klinik').count('klinik_id as total').first();

  return { data, total: total.total, page, limit };
};

const getKlinikById = async (id) => {
  return knex('klinik').where('klinik_id', id).first();
};

const createKlinik = async (klinikData) => {
  return knex('klinik').insert(klinikData).returning('*');
};

const updateKlinik = async (id, klinikData) => {
  return knex('klinik').where('klinik_id', id).update(klinikData).returning('*');
};

const deleteKlinik = async (id) => {
  return knex('klinik').where('klinik_id', id).del();
};

module.exports = {
  getAllKlinik,
  getKlinikById,
  createKlinik,
  updateKlinik,
  deleteKlinik,
};
