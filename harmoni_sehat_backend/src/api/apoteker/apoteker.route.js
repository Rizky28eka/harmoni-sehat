const express = require('express');
const router = express.Router();
const apotekerController = require('./apoteker.controller');
const { createApotekerValidation, updateApotekerValidation } = require('./apoteker.validation');

router.get('/', apotekerController.getAllApoteker);
router.get('/:id', apotekerController.getApotekerById);
router.post('/', createApotekerValidation, apotekerController.createApoteker);
router.put('/:id', updateApotekerValidation, apotekerController.updateApoteker);
router.delete('/:id', apotekerController.deleteApoteker);

module.exports = router;
