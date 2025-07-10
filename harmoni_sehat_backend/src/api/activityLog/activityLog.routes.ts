import { Router } from 'express';
import activityLogController from './activityLog.controller';
import { validate } from '../../middlewares/validator';
import { createActivityLogSchema, updateActivityLogSchema } from './activityLog.validation';

const router = Router();

router.route('/')
  .post(validate(createActivityLogSchema), activityLogController.createActivityLog)
  .get(activityLogController.getAllActivityLogs);

router.route('/:id')
  .get(activityLogController.getActivityLogById)
  .put(validate(updateActivityLogSchema), activityLogController.updateActivityLog)
  .delete(activityLogController.deleteActivityLog);

export default router;