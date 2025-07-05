const express = require('express');
const Obat = require('../../models/Obat');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Obat))
  .get(getAll(Obat));

router.route('/:id')
  .get(getOne(Obat))
  .patch(updateOne(Obat))
  .delete(deleteOne(Obat));

module.exports = router;
