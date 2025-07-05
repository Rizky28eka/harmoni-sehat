const express = require('express');
const Apoteker = require('../../models/Apoteker');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Apoteker))
  .get(getAll(Apoteker));

router.route('/:id')
  .get(getOne(Apoteker))
  .patch(updateOne(Apoteker))
  .delete(deleteOne(Apoteker));

module.exports = router;
