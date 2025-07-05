const knex = require('../../config/db');

const getAllApotek = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('apotek').select('*');

  if (search) {
    query.where('nama_apotek', 'like', `%${search}%`)
         .orWhere('email', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('apotek').count('apotek_id as total').first();

  return { data, total: total.total, page, limit };
};

const getApotekById = async (id) => {
  return knex('apotek').where('apotek_id', id).first();
};

const createApotek = async (apotekData) => {
  return knex('apotek').insert(apotekData).returning('*');
};

const updateApotek = async (id, apotekData) => {
  return knex('apotek').where('apotek_id', id).update(apotekData).returning('*');
};

const deleteApotek = async (id) => {
  return knex('apotek').where('apotek_id', id).del();
};

// Relational endpoints
const getApotekApoteker = async (apotekId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('apoteker')
    .select('apoteker.*', 'users.nama_lengkap as nama_apoteker')
    .join('users', 'apoteker.user_id', 'users.user_id')
    .where('apotek_id', apotekId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('apoteker').where('apotek_id', apotekId).count('apoteker_id as total').first();

  return { data, total: total.total, page, limit };
};

module.exports = {
  getAllApotek,
  getApotekById,
  createApotek,
  updateApotek,
  deleteApotek,
  getApotekApoteker,
};
