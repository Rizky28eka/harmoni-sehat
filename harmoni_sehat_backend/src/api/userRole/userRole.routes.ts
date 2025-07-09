import { Router } from 'express';
import UserRoleController from './userRole.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createUserRoleSchema, updateUserRoleSchema } from './userRole.validation';

const router = Router();

// All user role routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.post('/', validate(createUserRoleSchema), UserRoleController.createUserRole);
router.get('/', UserRoleController.getAllUserRoles);
router.get('/:id', UserRoleController.getUserRoleById);
router.get('/user/:userId', UserRoleController.getUserRolesByUserId);
router.put('/:id', validate(updateUserRoleSchema), UserRoleController.updateUserRole);
router.delete('/:id', UserRoleController.deleteUserRole);

export default router;
