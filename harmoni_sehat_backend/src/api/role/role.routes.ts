import { Router } from 'express';
import roleController from './role.controller';
import { validate } from '../../middlewares/validator';
import { createRoleSchema, updateRoleSchema } from './role.validation';

const router = Router();

router.route('/')
  .post(validate(createRoleSchema), roleController.createRole)
  .get(roleController.getAllRoles);

router.route('/:id')
  .get(roleController.getRoleById)
  .put(validate(updateRoleSchema), roleController.updateRole)
  .delete(roleController.deleteRole);

export default router;