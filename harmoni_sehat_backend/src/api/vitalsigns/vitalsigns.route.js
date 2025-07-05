const express = require('express');
const VitalSigns = require('../../models/VitalSigns');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(VitalSigns))
  .get(getAll(VitalSigns));

router.route('/:id')
  .get(getOne(VitalSigns))
  .patch(updateOne(VitalSigns))
  .delete(deleteOne(VitalSigns));

module.exports = router;
