import { Router } from 'express';
import notificationController from './notification.controller';
import { validate } from '../../middlewares/validator';
import { createNotificationSchema, updateNotificationSchema } from './notification.validation';

const router = Router();

router.route('/')
  .post(validate(createNotificationSchema), notificationController.createNotification)
  .get(notificationController.getAllNotifications);

router.route('/:id')
  .get(notificationController.getNotificationById)
  .put(validate(updateNotificationSchema), notificationController.updateNotification)
  .delete(notificationController.deleteNotification);

export default router;