import { Router } from 'express';
import UserProfileController from './userProfile.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createUserProfileSchema, updateUserProfileSchema } from './userProfile.validation';

const router = Router();

// All user profile routes are protected
router.use(protect);

// Route for a logged-in user to create their own user profile
router.post('/', authorize('patient', 'doctor', 'pharmacist', 'admin'), validate(createUserProfileSchema), UserProfileController.createUserProfile);

// Route for a logged-in user to get their own user profile
router.get('/me', UserProfileController.getMyUserProfile);

// Routes for admin to get all user profiles
router.get('/', authorize('admin'), UserProfileController.getAllUserProfiles);

// Routes for specific user profile by ID
router.get('/:id', UserProfileController.getUserProfileById);
router.put('/:id', validate(updateUserProfileSchema), UserProfileController.updateUserProfile);
router.delete('/:id', UserProfileController.deleteUserProfile);

export default router;
