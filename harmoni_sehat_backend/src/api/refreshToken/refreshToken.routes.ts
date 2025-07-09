import { Router } from 'express';
import RefreshTokenController from './refreshToken.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createRefreshTokenSchema, updateRefreshTokenSchema } from './refreshToken.validation';

const router = Router();

// All refresh token routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.post('/', validate(createRefreshTokenSchema), RefreshTokenController.createRefreshToken);
router.get('/', RefreshTokenController.getAllRefreshTokens);
router.get('/:id', RefreshTokenController.getRefreshTokenById);
router.put('/:id', validate(updateRefreshTokenSchema), RefreshTokenController.updateRefreshToken);
router.delete('/:id', RefreshTokenController.deleteRefreshToken);

export default router;
