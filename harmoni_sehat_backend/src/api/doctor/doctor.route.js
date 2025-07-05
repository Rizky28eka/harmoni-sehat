const express = require('express');
const Doctor = require('../../models/Doctor');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Doctor))
  .get(getAll(Doctor));

router.route('/:id')
  .get(getOne(Doctor))
  .patch(updateOne(Doctor))
  .delete(deleteOne(Doctor));

module.exports = router;
