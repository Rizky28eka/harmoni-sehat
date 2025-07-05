const knex = require('../../config/db');

const getAllRumahSakit = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('rumah_sakit').select('*');

  if (search) {
    query.where('nama_rumah_sakit', 'like', `%${search}%`)
         .orWhere('email', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('rumah_sakit').count('rumah_sakit_id as total').first();

  return { data, total: total.total, page, limit };
};

const getRumahSakitById = async (id) => {
  return knex('rumah_sakit').where('rumah_sakit_id', id).first();
};

const createRumahSakit = async (rumahSakitData) => {
  return knex('rumah_sakit').insert(rumahSakitData).returning('*');
};

const updateRumahSakit = async (id, rumahSakitData) => {
  return knex('rumah_sakit').where('rumah_sakit_id', id).update(rumahSakitData).returning('*');
};

const deleteRumahSakit = async (id) => {
  return knex('rumah_sakit').where('rumah_sakit_id', id).del();
};

module.exports = {
  getAllRumahSakit,
  getRumahSakitById,
  createRumahSakit,
  updateRumahSakit,
  deleteRumahSakit,
};
