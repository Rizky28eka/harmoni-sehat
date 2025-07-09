import { Router } from 'express';
import NotificationController from './notification.controller';
import validate from '../../middlewares/validator';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { createNotificationSchema, updateNotificationSchema } from './notification.validation';

const router = Router();

// All notification routes are protected
router.use(protect);

// Routes for creating notifications (admin only, or internal system)
router.post('/', authorize('admin'), validate(createNotificationSchema), NotificationController.createNotification);

// Routes for getting user's own notifications
router.get('/me', NotificationController.getMyNotifications);

// Routes for admin to get all notifications
router.get('/', authorize('admin'), NotificationController.getAllNotifications);

// Routes for specific notification by ID
router.get('/:id', NotificationController.getNotificationById);
router.put('/:id', NotificationController.updateNotification);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
