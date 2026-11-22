import { expirePendingConsultations } from '../api/booking/booking.service';
import { expireUnpaidOrders } from '../api/shop/shop.service';

import MedicationReminder from '../models/MedicationReminder';
import { asSystem } from '../utils/requestContext';
import { notify } from './notify';

let timer: NodeJS.Timeout | null = null;
let lastReminderMinute = '';

/** Sends due medication reminders (times are WIB, HH:mm). Runs at most once per minute. */
export const sendDueReminders = async (now = new Date()) => {
  const wib = new Date(now.getTime() + 7 * 3600 * 1000);
  const hhmm = wib.toISOString().slice(11, 16);
  const minuteKey = wib.toISOString().slice(0, 16);
  if (minuteKey === lastReminderMinute) return 0;
  lastReminderMinute = minuteKey;
  const due = await asSystem(() =>
    MedicationReminder.find({
      is_active: true,
      jam: hhmm,
      tanggal_mulai: { $lte: now },
      $or: [{ tanggal_selesai: { $exists: false } }, { tanggal_selesai: null }, { tanggal_selesai: { $gte: now } }],
    }),
  );
  await Promise.all(due.map((r) => notify(String(r.user_id), { judul: 'Waktunya minum obat', isi: `${r.nama_obat}${r.dosis ? ` — ${r.dosis}` : ''}`, tipe: 'info', data: { type: 'reminder', id: String(r._id) } })));
  return due.length;
};

/** Housekeeping: release unpaid consultation slots and restock unpaid orders. */
export const startJobs = (intervalMs = 60_000) => {
  if (timer) return;
  const tick = async () => {
    try {
      const [c, o] = await Promise.all([expirePendingConsultations(), expireUnpaidOrders()]);
      await sendDueReminders();
      if (c || o) console.log(`[jobs] expired ${c} consultation(s), ${o} order(s)`);
    } catch (err) {
      console.error('[jobs] failed', err);
    }
  };
  timer = setInterval(tick, intervalMs);
  timer.unref();
};

export const stopJobs = () => {
  if (timer) clearInterval(timer);
  timer = null;
};
