/** Time helpers. All practice schedules are expressed in Western Indonesia Time (WIB, UTC+7). */
export const TZ_OFFSET = '+07:00';
export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

export const parseWibDate = (dateStr: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(`${dateStr}T12:00:00${TZ_OFFSET}`);
  return isNaN(d.getTime()) ? null : d;
};

export const dayNameOf = (dateStr: string): string | null => {
  const d = parseWibDate(dateStr);
  if (!d) return null;
  // Noon WIB == 05:00 UTC, so the UTC weekday equals the WIB weekday.
  return DAY_NAMES[d.getUTCDay()];
};

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const slotStart = (dateStr: string, minutes: number) => {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return new Date(`${dateStr}T${hh}:${mm}:00${TZ_OFFSET}`);
};

export interface Slot {
  jadwal_id: string;
  klinik_id: string;
  start: Date;
  end: Date;
}

export const generateSlots = (
  dateStr: string,
  schedule: { _id: any; klinik_id: any; jam_mulai: string; jam_selesai: string; durasi_menit?: number },
): Slot[] => {
  const dur = schedule.durasi_menit || 30;
  const from = toMinutes(schedule.jam_mulai);
  const to = toMinutes(schedule.jam_selesai);
  const out: Slot[] = [];
  for (let t = from; t + dur <= to; t += dur) {
    out.push({
      jadwal_id: String(schedule._id),
      klinik_id: String(schedule.klinik_id),
      start: slotStart(dateStr, t),
      end: slotStart(dateStr, t + dur),
    });
  }
  return out;
};
