const knex = require('../../config/db');

const getAllFaq = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('faq').select('*');

  if (search) {
    query.where('pertanyaan', 'like', `%${search}%`)
         .orWhere('jawaban', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('faq').count('faq_id as total').first();

  return { data, total: total.total, page, limit };
};

const getFaqById = async (id) => {
  return knex('faq').where('faq_id', id).first();
};

const createFaq = async (faqData) => {
  return knex('faq').insert(faqData).returning('*');
};

const updateFaq = async (id, faqData) => {
  return knex('faq').where('faq_id', id).update(faqData).returning('*');
};

const deleteFaq = async (id) => {
  return knex('faq').where('faq_id', id).del();
};

module.exports = {
  getAllFaq,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
