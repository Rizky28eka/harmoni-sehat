const express = require('express');
const Promo = require('../../models/Promo');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Promo))
  .get(getAll(Promo));

router.route('/:id')
  .get(getOne(Promo))
  .patch(updateOne(Promo))
  .delete(deleteOne(Promo));

module.exports = router;
