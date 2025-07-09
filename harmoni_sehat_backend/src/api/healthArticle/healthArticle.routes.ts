import { Router } from 'express';
import HealthArticleController from './healthArticle.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createHealthArticleSchema, updateHealthArticleSchema } from './healthArticle.validation';

const router = Router();

// Routes that can be accessed by any authenticated user
router.use(protect);
router.get('/', HealthArticleController.getAllHealthArticles);
router.get('/:id', HealthArticleController.getHealthArticleById);

// Routes restricted to admin or doctor (author)
router.post('/', authorize('admin', 'doctor'), validate(createHealthArticleSchema), HealthArticleController.createHealthArticle);
router.put('/:id', authorize('admin', 'doctor'), validate(updateHealthArticleSchema), HealthArticleController.updateHealthArticle);
router.delete('/:id', authorize('admin', 'doctor'), HealthArticleController.deleteHealthArticle);

export default router;
