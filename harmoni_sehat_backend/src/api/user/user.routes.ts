import { Router } from 'express';
import userController from './user.controller';
import { validate } from '../../middlewares/validator';
import { createUserSchema, updateUserSchema } from './user.validation';

const router = Router();

router.route('/')
  .post(validate(createUserSchema), userController.createUser)
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .put(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

export default router;