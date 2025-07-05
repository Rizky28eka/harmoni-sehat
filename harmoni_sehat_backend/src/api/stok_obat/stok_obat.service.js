const knex = require('../../config/db');

const getAllStokObat = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('stok_obat')
    .select('stok_obat.*', 'obat.nama_obat', 'apotek.nama_apotek')
    .join('obat', 'stok_obat.obat_id', 'obat.obat_id')
    .join('apotek', 'stok_obat.apotek_id', 'apotek.apotek_id');

  if (search) {
    query.where('obat.nama_obat', 'like', `%${search}%`)
         .orWhere('apotek.nama_apotek', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('stok_obat').count('stok_id as total').first();

  return { data, total: total.total, page, limit };
};

const getStokObatById = async (id) => {
  return knex('stok_obat')
    .select('stok_obat.*', 'obat.nama_obat', 'apotek.nama_apotek')
    .join('obat', 'stok_obat.obat_id', 'obat.obat_id')
    .join('apotek', 'stok_obat.apotek_id', 'apotek.apotek_id')
    .where('stok_id', id)
    .first();
};

const createStokObat = async (stokObatData) => {
  return knex('stok_obat').insert(stokObatData).returning('*');
};

const updateStokObat = async (id, stokObatData) => {
  return knex('stok_obat').where('stok_id', id).update(stokObatData).returning('*');
};

const deleteStokObat = async (id) => {
  return knex('stok_obat').where('stok_id', id).del();
};

module.exports = {
  getAllStokObat,
  getStokObatById,
  createStokObat,
  updateStokObat,
  deleteStokObat,
};