const express = require('express');
const AppAnalytics = require('../../models/AppAnalytics');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(AppAnalytics))
  .get(getAll(AppAnalytics));

router.route('/:id')
  .get(getOne(AppAnalytics))
  .patch(updateOne(AppAnalytics))
  .delete(deleteOne(AppAnalytics));

module.exports = router;
