const express = require('express');
const Pengiriman = require('../../models/Pengiriman');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Pengiriman))
  .get(getAll(Pengiriman));

router.route('/:id')
  .get(getOne(Pengiriman))
  .patch(updateOne(Pengiriman))
  .delete(deleteOne(Pengiriman));

module.exports = router;
