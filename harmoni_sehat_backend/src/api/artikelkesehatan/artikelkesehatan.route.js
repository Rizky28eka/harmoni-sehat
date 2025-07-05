const express = require('express');
const ArtikelKesehatan = require('../../models/ArtikelKesehatan');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(ArtikelKesehatan))
  .get(getAll(ArtikelKesehatan));

router.route('/:id')
  .get(getOne(ArtikelKesehatan))
  .patch(updateOne(ArtikelKesehatan))
  .delete(deleteOne(ArtikelKesehatan));

module.exports = router;
