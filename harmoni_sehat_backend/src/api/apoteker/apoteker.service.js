const knex = require('../../config/db');

const getAllApoteker = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('apoteker')
    .select('apoteker.*', 'users.email', 'users.phone', 'apotek.nama_apotek')
    .join('users', 'apoteker.user_id', 'users.user_id')
    .leftJoin('apotek', 'apoteker.apotek_id', 'apotek.apotek_id');

  if (search) {
    query.where('nama_lengkap', 'like', `%${search}%`)
         .orWhere('no_sipa', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('apoteker').count('apoteker_id as total').first();

  return { data, total: total.total, page, limit };
};

const getApotekerById = async (id) => {
  return knex('apoteker')
    .select('apoteker.*', 'users.email', 'users.phone', 'apotek.nama_apotek')
    .join('users', 'apoteker.user_id', 'users.user_id')
    .leftJoin('apotek', 'apoteker.apotek_id', 'apotek.apotek_id')
    .where('apoteker_id', id)
    .first();
};

const createApoteker = async (apotekerData) => {
  return knex('apoteker').insert(apotekerData).returning('*');
};

const updateApoteker = async (id, apotekerData) => {
  return knex('apoteker').where('apoteker_id', id).update(apotekerData).returning('*');
};

const deleteApoteker = async (id) => {
  return knex('apoteker').where('apoteker_id', id).del();
};

module.exports = {
  getAllApoteker,
  getApotekerById,
  createApoteker,
  updateApoteker,
  deleteApoteker,
};
