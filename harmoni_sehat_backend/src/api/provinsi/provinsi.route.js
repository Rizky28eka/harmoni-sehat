const express = require('express');
const Provinsi = require('../../models/Provinsi');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Provinsi))
  .get(getAll(Provinsi));

router.route('/:id')
  .get(getOne(Provinsi))
  .patch(updateOne(Provinsi))
  .delete(deleteOne(Provinsi));

module.exports = router;
