const express = require('express');
const ChatSession = require('../../models/ChatSession');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(ChatSession))
  .get(getAll(ChatSession));

router.route('/:id')
  .get(getOne(ChatSession))
  .patch(updateOne(ChatSession))
  .delete(deleteOne(ChatSession));

module.exports = router;
