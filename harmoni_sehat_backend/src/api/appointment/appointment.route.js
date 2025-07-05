const express = require('express');
const Appointment = require('../../models/Appointment');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Appointment))
  .get(getAll(Appointment));

router.route('/:id')
  .get(getOne(Appointment))
  .patch(updateOne(Appointment))
  .delete(deleteOne(Appointment));

module.exports = router;
