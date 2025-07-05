const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { createUserValidation, updateUserValidation } = require('./user.validation');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', createUserValidation, userController.createUser);
router.put('/:id', updateUserValidation, userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Relational routes
router.get('/:id/promos', userController.getUserPromos);

module.exports = router;
