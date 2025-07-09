import { Router } from 'express';
import AdminController from './admin.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createAdminSchema, updateAdminSchema } from './admin.validation';

const router = Router();

// All admin routes are protected
router.use(protect);

// Routes for creating admin profiles (only by admin)
router.post('/', authorize('admin'), validate(createAdminSchema), AdminController.createAdmin);

// Route for a logged-in admin to get their own admin profile
router.get('/me', authorize('admin'), AdminController.getMyAdminProfile);

// Routes for specific admin by ID
router.get('/:id', authorize('admin'), AdminController.getAdminById);
router.put('/:id', authorize('admin'), validate(updateAdminSchema), AdminController.updateAdmin);
router.delete('/:id', authorize('admin'), AdminController.deleteAdmin);

export default router;
