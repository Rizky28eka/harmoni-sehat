const knex = require('../../config/db');

const getAllLogs = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('logs')
    .select('logs.*', 'users.email')
    .leftJoin('users', 'logs.user_id', 'users.user_id');

  if (search) {
    query.where('action', 'like', `%${search}%`)
         .orWhere('table_name', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('logs').count('log_id as total').first();

  return { data, total: total.total, page, limit };
};

const getLogsById = async (id) => {
  return knex('logs')
    .select('logs.*', 'users.email')
    .leftJoin('users', 'logs.user_id', 'users.user_id')
    .where('log_id', id)
    .first();
};

const createLogs = async (logsData) => {
  return knex('logs').insert(logsData).returning('*');
};

const updateLogs = async (id, logsData) => {
  return knex('logs').where('log_id', id).update(logsData).returning('*');
};

const deleteLogs = async (id) => {
  return knex('logs').where('log_id', id).del();
};

module.exports = {
  getAllLogs,
  getLogsById,
  createLogs,
  updateLogs,
  deleteLogs,
};
