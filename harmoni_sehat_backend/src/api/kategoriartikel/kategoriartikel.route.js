const express = require('express');
const KategoriArtikel = require('../../models/KategoriArtikel');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(KategoriArtikel))
  .get(getAll(KategoriArtikel));

router.route('/:id')
  .get(getOne(KategoriArtikel))
  .patch(updateOne(KategoriArtikel))
  .delete(deleteOne(KategoriArtikel));

module.exports = router;
