import { z } from 'zod';

export const createNotificationSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  judul: z.string().min(1, 'Judul tidak boleh kosong').trim(),
  isi: z.string().min(1, 'Isi notifikasi tidak boleh kosong').trim(),
  tipe: z.string().min(1, 'Tipe notifikasi tidak boleh kosong').trim(),
  is_read: z.boolean().optional(),
});

export const updateNotificationSchema = z.object({
  judul: z.string().min(1, 'Judul tidak boleh kosong').trim().optional(),
  isi: z.string().min(1, 'Isi notifikasi tidak boleh kosong').trim().optional(),
  tipe: z.string().min(1, 'Tipe notifikasi tidak boleh kosong').trim().optional(),
  is_read: z.boolean().optional(),
});