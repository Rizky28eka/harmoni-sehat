const knex = require('../../config/db');

const getAllPengiriman = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('pengiriman')
    .select('pengiriman.*', 'resep.kode_resep', 'kurir.nama_kurir')
    .join('resep', 'pengiriman.resep_id', 'resep.resep_id')
    .leftJoin('kurir', 'pengiriman.kurir_id', 'kurir.kurir_id');

  if (search) {
    query.where('alamat_pengiriman', 'like', `%${search}%`)
         .orWhere('status_pengiriman', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('pengiriman').count('pengiriman_id as total').first();

  return { data, total: total.total, page, limit };
};

const getPengirimanById = async (id) => {
  return knex('pengiriman')
    .select('pengiriman.*', 'resep.kode_resep', 'kurir.nama_kurir')
    .join('resep', 'pengiriman.resep_id', 'resep.resep_id')
    .leftJoin('kurir', 'pengiriman.kurir_id', 'kurir.kurir_id')
    .where('pengiriman_id', id)
    .first();
};

const createPengiriman = async (pengirimanData) => {
  return knex('pengiriman').insert(pengirimanData).returning('*');
};

const updatePengiriman = async (id, pengirimanData) => {
  return knex('pengiriman').where('pengiriman_id', id).update(pengirimanData).returning('*');
};

const deletePengiriman = async (id) => {
  return knex('pengiriman').where('pengiriman_id', id).del();
};

module.exports = {
  getAllPengiriman,
  getPengirimanById,
  createPengiriman,
  updatePengiriman,
  deletePengiriman,
};
