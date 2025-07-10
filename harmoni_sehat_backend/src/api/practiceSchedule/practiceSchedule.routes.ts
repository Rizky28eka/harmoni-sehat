import { Router } from 'express';
import practiceScheduleController from './practiceSchedule.controller';
import { validate } from '../../middlewares/validator';
import { createPracticeScheduleSchema, updatePracticeScheduleSchema } from './practiceSchedule.validation';

const router = Router();

router.route('/')
  .post(validate(createPracticeScheduleSchema), practiceScheduleController.createPracticeSchedule)
  .get(practiceScheduleController.getAllPracticeSchedules);

router.route('/:id')
  .get(practiceScheduleController.getPracticeScheduleById)
  .put(validate(updatePracticeScheduleSchema), practiceScheduleController.updatePracticeSchedule)
  .delete(practiceScheduleController.deletePracticeSchedule);

export default router;