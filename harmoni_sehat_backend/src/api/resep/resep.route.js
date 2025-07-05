const express = require('express');
const Resep = require('../../models/Resep');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Resep))
  .get(getAll(Resep));

router.route('/:id')
  .get(getOne(Resep))
  .patch(updateOne(Resep))
  .delete(deleteOne(Resep));

module.exports = router;
