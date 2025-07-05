const knex = require('../../config/db');

const getAllAppointment = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const query = knex('appointment')
    .select('appointment.*', 'pasien.nama_lengkap as pasien_name', 'doctor.nama_lengkap as doctor_name')
    .join('pasien', 'appointment.pasien_id', 'pasien.pasien_id')
    .join('doctor', 'appointment.doctor_id', 'doctor.doctor_id');

  if (search) {
    query.where('keluhan', 'like', `%${search}%`)
         .orWhere('status', 'like', `%${search}%`);
  }

  const data = await query.limit(limit).offset(offset);
  const total = await knex('appointment').count('appointment_id as total').first();

  return { data, total: total.total, page, limit };
};

const getAppointmentById = async (id) => {
  return knex('appointment')
    .select('appointment.*', 'pasien.nama_lengkap as pasien_name', 'doctor.nama_lengkap as doctor_name')
    .join('pasien', 'appointment.pasien_id', 'pasien.pasien_id')
    .join('doctor', 'appointment.doctor_id', 'doctor.doctor_id')
    .where('appointment_id', id)
    .first();
};

const createAppointment = async (appointmentData) => {
  return knex('appointment').insert(appointmentData).returning('*');
};

const updateAppointment = async (id, appointmentData) => {
  return knex('appointment').where('appointment_id', id).update(appointmentData).returning('*');
};

const deleteAppointment = async (id) => {
  return knex('appointment').where('appointment_id', id).del();
};

module.exports = {
  getAllAppointment,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
