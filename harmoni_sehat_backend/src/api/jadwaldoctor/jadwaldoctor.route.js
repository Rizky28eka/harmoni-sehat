const express = require('express');
const JadwalDoctor = require('../../models/JadwalDoctor');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(JadwalDoctor))
  .get(getAll(JadwalDoctor));

router.route('/:id')
  .get(getOne(JadwalDoctor))
  .patch(updateOne(JadwalDoctor))
  .delete(deleteOne(JadwalDoctor));

module.exports = router;
