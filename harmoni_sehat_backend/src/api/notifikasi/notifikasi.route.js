const express = require('express');
const Notifikasi = require('../../models/Notifikasi');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Notifikasi))
  .get(getAll(Notifikasi));

router.route('/:id')
  .get(getOne(Notifikasi))
  .patch(updateOne(Notifikasi))
  .delete(deleteOne(Notifikasi));

module.exports = router;
