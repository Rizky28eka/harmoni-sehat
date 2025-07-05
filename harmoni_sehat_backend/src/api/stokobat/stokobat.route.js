const express = require('express');
const StokObat = require('../../models/StokObat');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(StokObat))
  .get(getAll(StokObat));

router.route('/:id')
  .get(getOne(StokObat))
  .patch(updateOne(StokObat))
  .delete(deleteOne(StokObat));

module.exports = router;
