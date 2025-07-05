const hospitalService = require('./hospital.service');

async function getAllHospitals(req, res, next) {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    res.json(hospitals);
  } catch (error) {
    next(error);
  }
}

async function getHospitalById(req, res, next) {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    next(error);
  }
}

async function getDoctorsByHospital(req, res, next) {
  try {
    const doctors = await hospitalService.getDoctorsByHospital(req.params.id);
    res.json(doctors);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllHospitals,
  getHospitalById,
  getDoctorsByHospital,
};
