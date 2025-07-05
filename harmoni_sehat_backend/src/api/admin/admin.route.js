const express = require('express');
const Admin = require('../../models/Admin');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(Admin))
  .get(getAll(Admin));

router.route('/:id')
  .get(getOne(Admin))
  .patch(updateOne(Admin))
  .delete(deleteOne(Admin));

module.exports = router;
