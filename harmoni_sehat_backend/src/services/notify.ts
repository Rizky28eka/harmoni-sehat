import Notification from '../models/Notification';
import { asSystem } from '../utils/requestContext';
import { getIO } from '../sockets';
import { sendPush } from './push';

export interface NotifyInput {
  judul: string;
  isi: string;
  tipe?: 'info' | 'warning' | 'error' | 'success';
  /** Free-form routing data for the client (e.g. { type: 'consultation', id }) */
  data?: Record<string, string>;
}

/** Persist an in-app notification, push it over the socket and via FCM when configured. Never throws. */
export const notify = async (userId: string, input: NotifyInput) => {
  try {
    const doc = await asSystem(() =>
      Notification.create({
        user_id: userId,
        judul: input.judul,
        isi: input.isi,
        tipe: input.tipe ?? 'info',
        data: input.data,
      } as any),
    );
    getIO()?.to(`user:${userId}`).emit('notification', doc);
    await sendPush(userId, input.judul, input.isi, input.data);
    return doc;
  } catch (err) {
    console.error('notify failed', err);
    return null;
  }
};
