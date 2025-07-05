const knex = require('../../config/db');

const getAllKonsultasi = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('konsultasi')
    .select('konsultasi.*', 'pasien.nama_lengkap as pasien_name', 'doctor.nama_lengkap as doctor_name')
    .join('pasien', 'konsultasi.pasien_id', 'pasien.pasien_id')
    .join('doctor', 'konsultasi.doctor_id', 'doctor.doctor_id');

  if (search) {
    query.where('keluhan_utama', 'like', `%${search}%`)
         .orWhere('diagnosa', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('konsultasi').count('konsultasi_id as total').first();

  return { data, total: total.total, page, limit };
};

const getKonsultasiById = async (id) => {
  return knex('konsultasi')
    .select('konsultasi.*', 'pasien.nama_lengkap as pasien_name', 'doctor.nama_lengkap as doctor_name')
    .join('pasien', 'konsultasi.pasien_id', 'pasien.pasien_id')
    .join('doctor', 'konsultasi.doctor_id', 'doctor.doctor_id')
    .where('konsultasi_id', id)
    .first();
};

const createKonsultasi = async (konsultasiData) => {
  return knex('konsultasi').insert(konsultasiData).returning('*');
};

const updateKonsultasi = async (id, konsultasiData) => {
  return knex('konsultasi').where('konsultasi_id', id).update(konsultasiData).returning('*');
};

const deleteKonsultasi = async (id) => {
  return knex('konsultasi').where('konsultasi_id', id).del();
};

// Relational endpoints
const getKonsultasiResep = async (konsultasiId) => {
  return knex('resep').where('konsultasi_id', konsultasiId).first();
};

const getKonsultasiPembayaran = async (konsultasiId) => {
  return knex('pembayaran').where('konsultasi_id', konsultasiId).first();
};

module.exports = {
  getAllKonsultasi,
  getKonsultasiById,
  createKonsultasi,
  updateKonsultasi,
  deleteKonsultasi,
  getKonsultasiResep,
  getKonsultasiPembayaran,
};
