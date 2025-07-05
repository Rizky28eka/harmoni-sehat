const knex = require('../../config/db');

const getAllReviewRating = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('review_rating')
    .select('review_rating.*', 'konsultasi.keluhan_utama', 'reviewer.email as reviewer_email', 'reviewed.email as reviewed_email')
    .leftJoin('konsultasi', 'review_rating.konsultasi_id', 'konsultasi.konsultasi_id')
    .join('users as reviewer', 'review_rating.reviewer_id', 'reviewer.user_id')
    .join('users as reviewed', 'review_rating.reviewed_id', 'reviewed.user_id');

  if (search) {
    query.where('review_text', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('review_rating').count('review_id as total').first();

  return { data, total: total.total, page, limit };
};

const getReviewRatingById = async (id) => {
  return knex('review_rating')
    .select('review_rating.*', 'konsultasi.keluhan_utama', 'reviewer.email as reviewer_email', 'reviewed.email as reviewed_email')
    .leftJoin('konsultasi', 'review_rating.konsultasi_id', 'konsultasi.konsultasi_id')
    .join('users as reviewer', 'review_rating.reviewer_id', 'reviewer.user_id')
    .join('users as reviewed', 'review_rating.reviewed_id', 'reviewed.user_id')
    .where('review_id', id)
    .first();
};

const createReviewRating = async (reviewRatingData) => {
  return knex('review_rating').insert(reviewRatingData).returning('*');
};

const updateReviewRating = async (id, reviewRatingData) => {
  return knex('review_rating').where('review_id', id).update(reviewRatingData).returning('*');
};

const deleteReviewRating = async (id) => {
  return knex('review_rating').where('review_id', id).del();
};

module.exports = {
  getAllReviewRating,
  getReviewRatingById,
  createReviewRating,
  updateReviewRating,
  deleteReviewRating,
};
