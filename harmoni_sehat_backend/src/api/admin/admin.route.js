const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { createAdminValidation, updateAdminValidation } = require('./admin.validation');

router.get('/', adminController.getAllAdmin);
router.get('/:id', adminController.getAdminById);
router.post('/', createAdminValidation, adminController.createAdmin);
router.put('/:id', updateAdminValidation, adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
