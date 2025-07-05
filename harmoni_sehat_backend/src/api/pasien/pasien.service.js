const knex = require('../../config/db');

const getAllPasien = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('pasien')
    .select('pasien.*', 'users.email', 'users.phone')
    .join('users', 'pasien.user_id', 'users.user_id');

  if (search) {
    query.where('nama_lengkap', 'like', `%${search}%`)
         .orWhere('no_ktp', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('pasien').count('pasien_id as total').first();

  return { data, total: total.total, page, limit };
};

const getPasienById = async (id) => {
  return knex('pasien')
    .select('pasien.*', 'users.email', 'users.phone')
    .join('users', 'pasien.user_id', 'users.user_id')
    .where('pasien_id', id)
    .first();
};

const createPasien = async (pasienData) => {
  return knex('pasien').insert(pasienData).returning('*');
};

const updatePasien = async (id, pasienData) => {
  return knex('pasien').where('pasien_id', id).update(pasienData).returning('*');
};

const deletePasien = async (id) => {
  return knex('pasien').where('pasien_id', id).del();
};

// Relational endpoints
const getPasienKonsultasi = async (pasienId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('konsultasi')
    .select('*')
    .where('pasien_id', pasienId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('konsultasi').where('pasien_id', pasienId).count('konsultasi_id as total').first();

  return { data, total: total.total, page, limit };
};

module.exports = {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getPasienKonsultasi,
};
