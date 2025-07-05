const knex = require('../../config/db');

const getAllSystemSettings = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('system_settings').select('*');

  if (search) {
    query.where('setting_key', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('system_settings').count('setting_id as total').first();

  return { data, total: total.total, page, limit };
};

const getSystemSettingsById = async (id) => {
  return knex('system_settings').where('setting_id', id).first();
};

const createSystemSettings = async (settingsData) => {
  return knex('system_settings').insert(settingsData).returning('*');
};

const updateSystemSettings = async (id, settingsData) => {
  return knex('system_settings').where('setting_id', id).update(settingsData).returning('*');
};

const deleteSystemSettings = async (id) => {
  return knex('system_settings').where('setting_id', id).del();
};

module.exports = {
  getAllSystemSettings,
  getSystemSettingsById,
  createSystemSettings,
  updateSystemSettings,
  deleteSystemSettings,
};
