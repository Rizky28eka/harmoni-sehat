import { Router } from 'express';
import userController from './user.controller';
import { validate } from '../../middlewares/validator';
import { createUserValidation, updateUserValidation } from './user.validation';
import protect from '../../middlewares/protect';
import authorize from '../../middlewares/authorize';

const router = Router();

router.route('/')
  .post(createUserValidation, validate, userController.createUser)
  .get(protect, authorize('admin'), userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .put(updateUserValidation, validate, userController.updateUser)
  .delete(userController.deleteUser);

export default router;