import { Router } from 'express';
import userProfileController from './userProfile.controller';
import { validate } from '../../middlewares/validator';
import { createUserProfileSchema, updateUserProfileSchema } from './userProfile.validation';

const router = Router();

router.route('/')
  .post(validate(createUserProfileSchema), userProfileController.createUserProfile)
  .get(userProfileController.getAllUserProfiles);

router.route('/:id')
  .get(userProfileController.getUserProfileById)
  .put(validate(updateUserProfileSchema), userProfileController.updateUserProfile)
  .delete(userProfileController.deleteUserProfile);

export default router;