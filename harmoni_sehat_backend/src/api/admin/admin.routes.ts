import { Router } from 'express';
import adminController from './admin.controller';
import { validate } from '../../middlewares/validator';
import { createAdminSchema, updateAdminSchema } from './admin.validation';

const router = Router();

router.route('/')
  .post(validate(createAdminSchema), adminController.createAdmin)
  .get(adminController.getAllAdmins);

router.route('/:id')
  .get(adminController.getAdminById)
  .put(validate(updateAdminSchema), adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

export default router;