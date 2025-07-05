const express = require('express');
const UserPromo = require('../../models/UserPromo');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(UserPromo))
  .get(getAll(UserPromo));

router.route('/:id')
  .get(getOne(UserPromo))
  .patch(updateOne(UserPromo))
  .delete(deleteOne(UserPromo));

module.exports = router;
