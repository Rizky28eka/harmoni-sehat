import { Router } from 'express';
import userController from './user.controller';
import { validate } from '../../middlewares/validator';
import { createUserValidation, updateUserValidation } from './user.validation';

const router = Router();

router.route('/')
  .post(createUserValidation, validate, userController.createUser)
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .put(updateUserValidation, validate, userController.updateUser)
  .delete(userController.deleteUser);

export default router;