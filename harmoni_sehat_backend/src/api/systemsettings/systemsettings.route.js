const express = require('express');
const SystemSettings = require('../../models/SystemSettings');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(SystemSettings))
  .get(getAll(SystemSettings));

router.route('/:id')
  .get(getOne(SystemSettings))
  .patch(updateOne(SystemSettings))
  .delete(deleteOne(SystemSettings));

module.exports = router;
