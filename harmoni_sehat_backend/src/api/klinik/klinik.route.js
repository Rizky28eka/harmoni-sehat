const express = require('express');
const Klinik = require('../../models/Klinik');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Klinik))
  .get(getAll(Klinik));

router.route('/:id')
  .get(getOne(Klinik))
  .patch(updateOne(Klinik))
  .delete(deleteOne(Klinik));

module.exports = router;
