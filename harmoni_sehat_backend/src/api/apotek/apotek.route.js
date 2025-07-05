const express = require('express');
const Apotek = require('../../models/Apotek');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Apotek))
  .get(getAll(Apotek));

router.route('/:id')
  .get(getOne(Apotek))
  .patch(updateOne(Apotek))
  .delete(deleteOne(Apotek));

module.exports = router;
