const express = require('express');
const ChatMessage = require('../../models/ChatMessage');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(ChatMessage))
  .get(getAll(ChatMessage));

router.route('/:id')
  .get(getOne(ChatMessage))
  .patch(updateOne(ChatMessage))
  .delete(deleteOne(ChatMessage));

module.exports = router;
