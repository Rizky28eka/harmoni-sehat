import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import userRoleController from './userRole.controller';
import { validate } from '../../middlewares/validator';
import { createUserRoleSchema, updateUserRoleSchema } from './userRole.validation';

const router = Router();
router.use(accessPolicy(["admin"], ["admin"]));

router.route('/')
  .post(validate(createUserRoleSchema), userRoleController.createUserRole)
  .get(userRoleController.getAllUserRoles);

router.route('/:id')
  .get(userRoleController.getUserRoleById)
  .put(validate(updateUserRoleSchema), userRoleController.updateUserRole)
  .delete(userRoleController.deleteUserRole);

export default router;