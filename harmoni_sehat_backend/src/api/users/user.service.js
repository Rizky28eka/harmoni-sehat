const knex = require('../../config/db');

const getAllUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('users').select('*');

  if (search) {
    query.where('email', 'like', `%${search}%`)
         .orWhere('phone', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('users').count('user_id as total').first();

  return { data, total: total.total, page, limit };
};

const getUserById = async (id) => {
  return knex('users').where('user_id', id).first();
};

const createUser = async (userData) => {
  // Password hashing should be done before calling this service, e.g., in controller or a utility
  return knex('users').insert(userData).returning('*');
};

const updateUser = async (id, userData) => {
  return knex('users').where('user_id', id).update(userData).returning('*');
};

const deleteUser = async (id) => {
  return knex('users').where('user_id', id).del();
};

// Relational endpoints (example: get user's promos)
const getUserPromos = async (userId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('user_promo')
    .select('user_promo.*', 'promo.nama_promo', 'promo.kode_promo')
    .join('promo', 'user_promo.promo_id', 'promo.promo_id')
    .where('user_promo.user_id', userId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('user_promo').where('user_id', userId).count('user_promo_id as total').first();

  return { data, total: total.total, page, limit };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPromos,
};
