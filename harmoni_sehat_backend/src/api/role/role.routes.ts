import { Router } from 'express';
import RoleController from './role.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createRoleSchema, updateRoleSchema } from './role.validation';

const router = Router();

// All role routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.post('/', validate(createRoleSchema), RoleController.createRole);
router.get('/', RoleController.getAllRoles);
router.get('/:id', RoleController.getRoleById);
router.put('/:id', validate(updateRoleSchema), RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

export default router;
