const db = require('../../config/db');

function getAllHospitals() {
  return db('hospitals').select('*');
}

function getHospitalById(id) {
  return db('hospitals').where({ id }).first();
}

function getDoctorsByHospital(hospitalId) {
  return db('dokters').where({ hospital_id: hospitalId }).select('*');
}

module.exports = {
  getAllHospitals,
  getHospitalById,
  getDoctorsByHospital,
};
