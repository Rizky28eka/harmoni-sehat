const express = require('express');
const Feedback = require('../../models/Feedback');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Feedback))
  .get(getAll(Feedback));

router.route('/:id')
  .get(getOne(Feedback))
  .patch(updateOne(Feedback))
  .delete(deleteOne(Feedback));

module.exports = router;
