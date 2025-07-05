const express = require('express');
const Pasien = require('../../models/Pasien');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Pasien))
  .get(getAll(Pasien));

router.route('/:id')
  .get(getOne(Pasien))
  .patch(updateOne(Pasien))
  .delete(deleteOne(Pasien));

module.exports = router;
