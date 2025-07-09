import { Router } from 'express';
import UserController from './user.controller';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// All routes below this are now protected
router.use(protect);

router.get('/', authorize('admin'), UserController.getAllUsers);
router.get('/:id', authorize('admin'), UserController.getUserById);
router.put('/:id', authorize('admin'), UserController.updateUser);
router.delete('/:id', authorize('admin'), UserController.deleteUser);

export default router;
