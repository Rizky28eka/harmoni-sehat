const express = require('express');
const ReviewRating = require('../../models/ReviewRating');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(ReviewRating))
  .get(getAll(ReviewRating));

router.route('/:id')
  .get(getOne(ReviewRating))
  .patch(updateOne(ReviewRating))
  .delete(deleteOne(ReviewRating));

module.exports = router;
