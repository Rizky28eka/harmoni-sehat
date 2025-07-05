const express = require('express');
const DetailResep = require('../../models/DetailResep');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(DetailResep))
  .get(getAll(DetailResep));

router.route('/:id')
  .get(getOne(DetailResep))
  .patch(updateOne(DetailResep))
  .delete(deleteOne(DetailResep));

module.exports = router;
