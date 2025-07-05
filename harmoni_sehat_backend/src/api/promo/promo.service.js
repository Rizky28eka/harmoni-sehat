const knex = require('../../config/db');

const getAllPromo = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('promo').select('*');

  if (search) {
    query.where('nama_promo', 'like', `%${search}%`)
         .orWhere('kode_promo', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('promo').count('promo_id as total').first();

  return { data, total: total.total, page, limit };
};

const getPromoById = async (id) => {
  return knex('promo').where('promo_id', id).first();
};

const createPromo = async (promoData) => {
  return knex('promo').insert(promoData).returning('*');
};

const updatePromo = async (id, promoData) => {
  return knex('promo').where('promo_id', id).update(promoData).returning('*');
};

const deletePromo = async (id) => {
  return knex('promo').where('promo_id', id).del();
};

module.exports = {
  getAllPromo,
  getPromoById,
  createPromo,
  updatePromo,
  deletePromo,
};
