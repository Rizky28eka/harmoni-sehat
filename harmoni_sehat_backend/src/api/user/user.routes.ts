import { Router } from 'express';
import UserController from './user.controller';
import validate from '../../middlewares/validator';
// import { createUserSchema, updateUserSchema } from './user.validation'; // Assuming validation schemas

const router = Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validate({}), UserController.createUser); // Add actual schema here
router.put('/:id', validate({}), UserController.updateUser); // Add actual schema here
router.delete('/:id', UserController.deleteUser);

export default router;
