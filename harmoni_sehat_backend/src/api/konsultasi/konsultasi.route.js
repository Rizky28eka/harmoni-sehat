const express = require('express');
const Konsultasi = require('../../models/Konsultasi');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Konsultasi))
  .get(getAll(Konsultasi));

router.route('/:id')
  .get(getOne(Konsultasi))
  .patch(updateOne(Konsultasi))
  .delete(deleteOne(Konsultasi));

module.exports = router;
