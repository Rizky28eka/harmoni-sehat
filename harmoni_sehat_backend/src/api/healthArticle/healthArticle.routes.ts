import { Router } from 'express';
import healthArticleController from './healthArticle.controller';
import { validate } from '../../middlewares/validator';
import { createHealthArticleSchema, updateHealthArticleSchema } from './healthArticle.validation';

const router = Router();

router.route('/')
  .post(validate(createHealthArticleSchema), healthArticleController.createHealthArticle)
  .get(healthArticleController.getAllHealthArticles);

router.route('/:id')
  .get(healthArticleController.getHealthArticleById)
  .put(validate(updateHealthArticleSchema), healthArticleController.updateHealthArticle)
  .delete(healthArticleController.deleteHealthArticle);

export default router;