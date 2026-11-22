import { accessPolicy } from '../../middlewares/accessPolicy';
import { Router } from 'express';
import notificationController from './notification.controller';
import { validate } from '../../middlewares/validator';
import { createNotificationSchema, updateNotificationSchema } from './notification.validation';

const router = Router();
router.use(accessPolicy("any", "any"));

import Notification from '../../models/Notification';
import DeviceToken from '../../models/DeviceToken';
import { asSystem } from '../../utils/requestContext';
import { getActor } from '../../utils/actor';

router.get('/unread-count', async (_req, res, next) => {
  try {
    res.json({ status: 'success', data: { count: await Notification.countDocuments({ is_read: false }) } });
  } catch (e) { next(e); }
});
router.post('/read-all', async (_req, res, next) => {
  try {
    await Notification.updateMany({ is_read: false }, { is_read: true });
    res.json({ status: 'success' });
  } catch (e) { next(e); }
});
router.post('/:id/read', async (req, res, next) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
    if (!n) return next(new (require('../../utils/AppError').AppError)('Notifikasi tidak ditemukan', 404));
    res.json({ status: 'success', data: n });
  } catch (e) { next(e); }
});
router.post('/devices', async (req, res, next) => {
  try {
    const token = String(req.body?.token ?? '');
    if (token.length < 20) return next(new (require('../../utils/AppError').AppError)('Token perangkat tidak valid', 400));
    const actor = await getActor(req);
    await asSystem(() => DeviceToken.findOneAndUpdate({ token }, { user_id: actor.userId, platform: req.body?.platform ?? 'android' }, { upsert: true }));
    res.status(201).json({ status: 'success' });
  } catch (e) { next(e); }
});
router.delete('/devices/:token', async (req, res, next) => {
  try {
    const actor = await getActor(req);
    await asSystem(() => DeviceToken.deleteOne({ token: req.params.token, user_id: actor.userId }));
    res.json({ status: 'success' });
  } catch (e) { next(e); }
});

router.route('/')
  .post(validate(createNotificationSchema), notificationController.createNotification)
  .get(notificationController.getAllNotifications);

router.route('/:id')
  .get(notificationController.getNotificationById)
  .put(validate(updateNotificationSchema), notificationController.updateNotification)
  .delete(notificationController.deleteNotification);

export default router;