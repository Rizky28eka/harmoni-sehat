const express = require('express');
const Kurir = require('../../models/Kurir');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Kurir))
  .get(getAll(Kurir));

router.route('/:id')
  .get(getOne(Kurir))
  .patch(updateOne(Kurir))
  .delete(deleteOne(Kurir));

module.exports = router;
