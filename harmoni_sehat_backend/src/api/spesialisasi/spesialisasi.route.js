const express = require('express');
const Spesialisasi = require('../../models/Spesialisasi');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Spesialisasi))
  .get(getAll(Spesialisasi));

router.route('/:id')
  .get(getOne(Spesialisasi))
  .patch(updateOne(Spesialisasi))
  .delete(deleteOne(Spesialisasi));

module.exports = router;
