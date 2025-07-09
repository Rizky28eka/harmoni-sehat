import { Router } from 'express';
import ActivityLogController from './activityLog.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createActivityLogSchema, updateActivityLogSchema } from './activityLog.validation';

const router = Router();

// All activity log routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.post('/', validate(createActivityLogSchema), ActivityLogController.createActivityLog);
router.get('/', ActivityLogController.getAllActivityLogs);
router.get('/:id', ActivityLogController.getActivityLogById);
router.put('/:id', validate(updateActivityLogSchema), ActivityLogController.updateActivityLog);
router.delete('/:id', ActivityLogController.deleteActivityLog);

export default router;
