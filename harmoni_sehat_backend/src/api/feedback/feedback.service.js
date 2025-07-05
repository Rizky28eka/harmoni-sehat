const knex = require('../../config/db');

const getAllFeedback = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('feedback')
    .select('feedback.*', 'users.email')
    .leftJoin('users', 'feedback.user_id', 'users.user_id');

  if (search) {
    query.where('judul', 'like', `%${search}%`)
         .orWhere('deskripsi', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('feedback').count('feedback_id as total').first();

  return { data, total: total.total, page, limit };
};

const getFeedbackById = async (id) => {
  return knex('feedback')
    .select('feedback.*', 'users.email')
    .leftJoin('users', 'feedback.user_id', 'users.user_id')
    .where('feedback_id', id)
    .first();
};

const createFeedback = async (feedbackData) => {
  return knex('feedback').insert(feedbackData).returning('*');
};

const updateFeedback = async (id, feedbackData) => {
  return knex('feedback').where('feedback_id', id).update(feedbackData).returning('*');
};

const deleteFeedback = async (id) => {
  return knex('feedback').where('feedback_id', id).del();
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
