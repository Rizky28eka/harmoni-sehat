import { Router } from 'express';
import PracticeScheduleController from './practiceSchedule.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createPracticeScheduleSchema, updatePracticeScheduleSchema } from './practiceSchedule.validation';

const router = Router();

// All practice schedule routes are protected
router.use(protect);

// Routes for doctors to manage their own schedules
router.post('/', authorize('doctor'), validate(createPracticeScheduleSchema), PracticeScheduleController.createPracticeSchedule);
router.get('/me', authorize('doctor'), PracticeScheduleController.getMyPracticeSchedules);

// Routes for admin to get all schedules
router.get('/', authorize('admin'), PracticeScheduleController.getAllPracticeSchedules);

// Routes for specific schedule by ID
router.get('/:id', authorize('admin', 'doctor', 'patient'), PracticeScheduleController.getPracticeScheduleById);
router.put('/:id', authorize('admin', 'doctor'), validate(updatePracticeScheduleSchema), PracticeScheduleController.updatePracticeSchedule);
router.delete('/:id', authorize('admin', 'doctor'), PracticeScheduleController.deletePracticeSchedule);

export default router;
