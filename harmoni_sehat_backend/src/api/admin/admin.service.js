const knex = require('../../config/db');

const getAllAdmin = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('admin')
    .select('admin.*', 'users.email', 'users.phone')
    .join('users', 'admin.user_id', 'users.user_id');

  if (search) {
    query.where('nama_lengkap', 'like', `%${search}%`)
         .orWhere('departemen', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('admin').count('admin_id as total').first();

  return { data, total: total.total, page, limit };
};

const getAdminById = async (id) => {
  return knex('admin')
    .select('admin.*', 'users.email', 'users.phone')
    .join('users', 'admin.user_id', 'users.user_id')
    .where('admin_id', id)
    .first();
};

const createAdmin = async (adminData) => {
  return knex('admin').insert(adminData).returning('*');
};

const updateAdmin = async (id, adminData) => {
  return knex('admin').where('admin_id', id).update(adminData).returning('*');
};

const deleteAdmin = async (id) => {
  return knex('admin').where('admin_id', id).del();
};

module.exports = {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
