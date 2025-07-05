const knex = require('../../config/db');

const getAllResep = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('resep')
    .select('resep.*', 'konsultasi.keluhan_utama', 'doctor.nama_lengkap as doctor_name', 'pasien.nama_lengkap as pasien_name', 'apotek.nama_apotek')
    .leftJoin('konsultasi', 'resep.konsultasi_id', 'konsultasi.konsultasi_id')
    .join('doctor', 'resep.doctor_id', 'doctor.doctor_id')
    .join('pasien', 'resep.pasien_id', 'pasien.pasien_id')
    .leftJoin('apotek', 'resep.apotek_id', 'apotek.apotek_id');

  if (search) {
    query.where('kode_resep', 'like', `%${search}%`)
         .orWhere('status', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('resep').count('resep_id as total').first();

  return { data, total: total.total, page, limit };
};

const getResepById = async (id) => {
  return knex('resep')
    .select('resep.*', 'konsultasi.keluhan_utama', 'doctor.nama_lengkap as doctor_name', 'pasien.nama_lengkap as pasien_name', 'apotek.nama_apotek')
    .leftJoin('konsultasi', 'resep.konsultasi_id', 'konsultasi.konsultasi_id')
    .join('doctor', 'resep.doctor_id', 'doctor.doctor_id')
    .join('pasien', 'resep.pasien_id', 'pasien.pasien_id')
    .leftJoin('apotek', 'resep.apotek_id', 'apotek.apotek_id')
    .where('resep_id', id)
    .first();
};

const createResep = async (resepData) => {
  return knex('resep').insert(resepData).returning('*');
};

const updateResep = async (id, resepData) => {
  return knex('resep').where('resep_id', id).update(resepData).returning('*');
};

const deleteResep = async (id) => {
  return knex('resep').where('resep_id', id).del();
};

// Relational endpoints
const getResepDetailResep = async (resepId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('detail_resep')
    .select('detail_resep.*', 'obat.nama_obat')
    .join('obat', 'detail_resep.obat_id', 'obat.obat_id')
    .where('resep_id', resepId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('detail_resep').where('resep_id', resepId).count('detail_id as total').first();

  return { data, total: total.total, page, limit };
};

const getResepPembayaran = async (resepId) => {
  return knex('pembayaran').where('resep_id', resepId).first();
};

module.exports = {
  getAllResep,
  getResepById,
  createResep,
  updateResep,
  deleteResep,
  getResepDetailResep,
  getResepPembayaran,
};
