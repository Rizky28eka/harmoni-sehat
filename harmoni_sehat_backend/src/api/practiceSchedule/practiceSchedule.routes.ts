import { requireVerifiedProfessional } from '../../middlewares/verified';
import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import practiceScheduleController from './practiceSchedule.controller';
import { validate } from '../../middlewares/validator';
import { createPracticeScheduleSchema, updatePracticeScheduleSchema } from './practiceSchedule.validation';

const router = Router();
router.use(accessPolicy("any", ["dokter"]));
router.use((req, res, next) => (['dokter', 'farmasi'].includes((req as any).userRole) ? requireVerifiedProfessional(req, res, next) : next()));

router.route('/')
  .post(validate(createPracticeScheduleSchema), practiceScheduleController.createPracticeSchedule)
  .get(practiceScheduleController.getAllPracticeSchedules);

router.route('/:id')
  .get(practiceScheduleController.getPracticeScheduleById)
  .put(validate(updatePracticeScheduleSchema), practiceScheduleController.updatePracticeSchedule)
  .delete(practiceScheduleController.deletePracticeSchedule);

export default router;