const knex = require('../../config/db');

const getAllDetailResep = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('detail_resep')
    .select('detail_resep.*', 'resep.kode_resep', 'obat.nama_obat')
    .join('resep', 'detail_resep.resep_id', 'resep.resep_id')
    .join('obat', 'detail_resep.obat_id', 'obat.obat_id');

  if (search) {
    query.where('resep.kode_resep', 'like', `%${search}%`)
         .orWhere('obat.nama_obat', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('detail_resep').count('detail_id as total').first();

  return { data, total: total.total, page, limit };
};

const getDetailResepById = async (id) => {
  return knex('detail_resep')
    .select('detail_resep.*', 'resep.kode_resep', 'obat.nama_obat')
    .join('resep', 'detail_resep.resep_id', 'resep.resep_id')
    .join('obat', 'detail_resep.obat_id', 'obat.obat_id')
    .where('detail_id', id)
    .first();
};

const createDetailResep = async (detailResepData) => {
  return knex('detail_resep').insert(detailResepData).returning('*');
};

const updateDetailResep = async (id, detailResepData) => {
  return knex('detail_resep').where('detail_id', id).update(detailResepData).returning('*');
};

const deleteDetailResep = async (id) => {
  return knex('detail_resep').where('detail_id', id).del();
};

module.exports = {
  getAllDetailResep,
  getDetailResepById,
  createDetailResep,
  updateDetailResep,
  deleteDetailResep,
};
