const express = require('express');
const Kota = require('../../models/Kota');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Kota))
  .get(getAll(Kota));

router.route('/:id')
  .get(getOne(Kota))
  .patch(updateOne(Kota))
  .delete(deleteOne(Kota));

module.exports = router;
