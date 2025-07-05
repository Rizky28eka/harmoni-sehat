const knex = require('../../config/db');

const getAllMedicalRecord = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('medical_record')
    .select('medical_record.*', 'pasien.nama_lengkap as pasien_name', 'doctor.nama_lengkap as doctor_name', 'konsultasi.keluhan_utama')
    .join('pasien', 'medical_record.pasien_id', 'pasien.pasien_id')
    .join('doctor', 'medical_record.doctor_id', 'doctor.doctor_id')
    .leftJoin('konsultasi', 'medical_record.konsultasi_id', 'konsultasi.konsultasi_id');

  if (search) {
    query.where('diagnosa_utama', 'like', `%${search}%`)
         .orWhere('anamnesis', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('medical_record').count('record_id as total').first();

  return { data, total: total.total, page, limit };
};

const getMedicalRecordById = async (id) => {
  return knex('medical_record')
    .select('medical_record.*', 'pasien.nama_lengkap as pasien_name', 'doctor.nama_lengkap as doctor_name', 'konsultasi.keluhan_utama')
    .join('pasien', 'medical_record.pasien_id', 'pasien.pasien_id')
    .join('doctor', 'medical_record.doctor_id', 'doctor.doctor_id')
    .leftJoin('konsultasi', 'medical_record.konsultasi_id', 'konsultasi.konsultasi_id')
    .where('record_id', id)
    .first();
};

const createMedicalRecord = async (medicalRecordData) => {
  return knex('medical_record').insert(medicalRecordData).returning('*');
};

const updateMedicalRecord = async (id, medicalRecordData) => {
  return knex('medical_record').where('record_id', id).update(medicalRecordData).returning('*');
};

const deleteMedicalRecord = async (id) => {
  return knex('medical_record').where('record_id', id).del();
};

module.exports = {
  getAllMedicalRecord,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};
