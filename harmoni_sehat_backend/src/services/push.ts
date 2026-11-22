import DeviceToken from '../models/DeviceToken';
import { FCM_SERVICE_ACCOUNT_PATH } from '../config/env';

let messaging: any | null | undefined;

const getMessaging = () => {
  if (messaging !== undefined) return messaging;
  messaging = null;
  if (!FCM_SERVICE_ACCOUNT_PATH) return messaging;
  try {
    // firebase-admin is optional: only loaded when a service account is configured.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const admin = require('firebase-admin');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const credential = admin.credential.cert(require(require('path').resolve(FCM_SERVICE_ACCOUNT_PATH)));
    const app = admin.apps.length ? admin.app() : admin.initializeApp({ credential });
    messaging = admin.messaging(app);
  } catch (err) {
    console.error('FCM disabled:', (err as Error).message);
  }
  return messaging;
};

export const sendPush = async (userId: string, title: string, body: string, data?: Record<string, string>) => {
  const m = getMessaging();
  if (!m) return;
  const tokens = await DeviceToken.find({ user_id: userId }).distinct('token');
  if (!tokens.length) return;
  const res = await m.sendEachForMulticast({ tokens, notification: { title, body }, data: data ?? {} });
  // Prune tokens FCM says are dead.
  const dead: string[] = [];
  res.responses.forEach((r: any, i: number) => {
    const code = r.error?.code;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
      dead.push(tokens[i]);
    }
  });
  if (dead.length) await DeviceToken.deleteMany({ token: { $in: dead } });
};
