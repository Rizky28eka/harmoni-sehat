import { Router } from 'express';
import refreshTokenController from './refreshToken.controller';
import { validate } from '../../middlewares/validator';
import { createRefreshTokenSchema, updateRefreshTokenSchema } from './refreshToken.validation';

const router = Router();

router.route('/')
  .post(validate(createRefreshTokenSchema), refreshTokenController.createRefreshToken)
  .get(refreshTokenController.getAllRefreshTokens);

router.route('/:id')
  .get(refreshTokenController.getRefreshTokenById)
  .put(validate(updateRefreshTokenSchema), refreshTokenController.updateRefreshToken)
  .delete(refreshTokenController.deleteRefreshToken);

export default router;