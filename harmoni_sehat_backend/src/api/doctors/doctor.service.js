const knex = require('../../config/db');

const getAllDoctors = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('doctor')
    .select('doctor.*', 'users.email', 'users.phone', 'spesialisasi.nama_spesialisasi', 'rumah_sakit.nama_rumah_sakit')
    .join('users', 'doctor.user_id', 'users.user_id')
    .leftJoin('spesialisasi', 'doctor.spesialisasi_id', 'spesialisasi.spesialisasi_id')
    .leftJoin('rumah_sakit', 'doctor.rumah_sakit_id', 'rumah_sakit.rumah_sakit_id');

  if (search) {
    query.where('nama_lengkap', 'like', `%${search}%`)
         .orWhere('no_sip', 'like', `%${search}%`)
         .orWhere('spesialisasi.nama_spesialisasi', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('doctor').count('doctor_id as total').first();

  return { data, total: total.total, page, limit };
};

const getDoctorById = async (id) => {
  return knex('doctor')
    .select('doctor.*', 'users.email', 'users.phone', 'spesialisasi.nama_spesialisasi', 'rumah_sakit.nama_rumah_sakit')
    .join('users', 'doctor.user_id', 'users.user_id')
    .leftJoin('spesialisasi', 'doctor.spesialisasi_id', 'spesialisasi.spesialisasi_id')
    .leftJoin('rumah_sakit', 'doctor.rumah_sakit_id', 'rumah_sakit.rumah_sakit_id')
    .where('doctor_id', id)
    .first();
};

const createDoctor = async (doctorData) => {
  return knex('doctor').insert(doctorData).returning('*');
};

const updateDoctor = async (id, doctorData) => {
  return knex('doctor').where('doctor_id', id).update(doctorData).returning('*');
};

const deleteDoctor = async (id) => {
  return knex('doctor').where('doctor_id', id).del();
};

// Relational endpoints
const getDoctorJadwal = async (doctorId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('jadwal_doctor')
    .select('*')
    .where('doctor_id', doctorId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('jadwal_doctor').where('doctor_id', doctorId).count('jadwal_id as total').first();

  return { data, total: total.total, page, limit };
};

const getDoctorKonsultasi = async (doctorId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const data = await knex('konsultasi')
    .select('*')
    .where('doctor_id', doctorId)
    .limit(limit)
    .offset(offset);
  
  const total = await knex('konsultasi').where('doctor_id', doctorId).count('konsultasi_id as total').first();

  return { data, total: total.total, page, limit };
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorJadwal,
  getDoctorKonsultasi,
};
