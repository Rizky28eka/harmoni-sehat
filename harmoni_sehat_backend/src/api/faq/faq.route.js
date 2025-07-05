const express = require('express');
const FAQ = require('../../models/FAQ');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(FAQ))
  .get(getAll(FAQ));

router.route('/:id')
  .get(getOne(FAQ))
  .patch(updateOne(FAQ))
  .delete(deleteOne(FAQ));

module.exports = router;
