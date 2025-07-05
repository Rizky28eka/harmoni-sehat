const express = require('express');
const MedicalRecord = require('../../models/MedicalRecord');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(MedicalRecord))
  .get(getAll(MedicalRecord));

router.route('/:id')
  .get(getOne(MedicalRecord))
  .patch(updateOne(MedicalRecord))
  .delete(deleteOne(MedicalRecord));

module.exports = router;
