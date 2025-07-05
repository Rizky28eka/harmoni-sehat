const express = require('express');
const AuditTrail = require('../../models/AuditTrail');
const { createOne, getAll, getOne, updateOne, deleteOne } = require('../crud.controller');

const router = express.Router();

router.route('/')
  .post(createOne(AuditTrail))
  .get(getAll(AuditTrail));

router.route('/:id')
  .get(getOne(AuditTrail))
  .patch(updateOne(AuditTrail))
  .delete(deleteOne(AuditTrail));

module.exports = router;
