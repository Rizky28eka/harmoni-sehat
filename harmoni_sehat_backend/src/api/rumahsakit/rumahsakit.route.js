const express = require('express');
const RumahSakit = require('../../models/RumahSakit');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(RumahSakit))
  .get(getAll(RumahSakit));

router.route('/:id')
  .get(getOne(RumahSakit))
  .patch(updateOne(RumahSakit))
  .delete(deleteOne(RumahSakit));

module.exports = router;
