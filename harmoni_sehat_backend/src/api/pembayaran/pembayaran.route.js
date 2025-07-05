const express = require('express');
const Pembayaran = require('../../models/Pembayaran');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Pembayaran))
  .get(getAll(Pembayaran));

router.route('/:id')
  .get(getOne(Pembayaran))
  .patch(updateOne(Pembayaran))
  .delete(deleteOne(Pembayaran));

module.exports = router;
