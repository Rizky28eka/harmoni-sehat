const express = require('express');
const KategoriObat = require('../../models/KategoriObat');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(KategoriObat))
  .get(getAll(KategoriObat));

router.route('/:id')
  .get(getOne(KategoriObat))
  .patch(updateOne(KategoriObat))
  .delete(deleteOne(KategoriObat));

module.exports = router;
