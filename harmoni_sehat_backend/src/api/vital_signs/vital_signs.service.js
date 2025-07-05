const knex = require('../../config/db');

const getAllVitalSigns = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('vital_signs')
    .select('vital_signs.*', 'pasien.nama_lengkap as pasien_name', 'konsultasi.keluhan_utama')
    .join('pasien', 'vital_signs.pasien_id', 'pasien.pasien_id')
    .leftJoin('konsultasi', 'vital_signs.konsultasi_id', 'konsultasi.konsultasi_id');

  if (search) {
    query.where('catatan', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('vital_signs').count('vital_id as total').first();

  return { data, total: total.total, page, limit };
};

const getVitalSignsById = async (id) => {
  return knex('vital_signs')
    .select('vital_signs.*', 'pasien.nama_lengkap as pasien_name', 'konsultasi.keluhan_utama')
    .join('pasien', 'vital_signs.pasien_id', 'pasien.pasien_id')
    .leftJoin('konsultasi', 'vital_signs.konsultasi_id', 'konsultasi.konsultasi_id')
    .where('vital_id', id)
    .first();
};

const createVitalSigns = async (vitalSignsData) => {
  return knex('vital_signs').insert(vitalSignsData).returning('*');
};

const updateVitalSigns = async (id, vitalSignsData) => {
  return knex('vital_signs').where('vital_id', id).update(vitalSignsData).returning('*');
};

const deleteVitalSigns = async (id) => {
  return knex('vital_signs').where('vital_id', id).del();
};

module.exports = {
  getAllVitalSigns,
  getVitalSignsById,
  createVitalSigns,
  updateVitalSigns,
  deleteVitalSigns,
};
