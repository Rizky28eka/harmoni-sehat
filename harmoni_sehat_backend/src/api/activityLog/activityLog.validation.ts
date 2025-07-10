import { z } from 'zod';

export const createActivityLogSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  aksi: z.string().min(1, 'Aksi tidak boleh kosong').trim(),
  deskripsi: z.string().optional(),
});

export const updateActivityLogSchema = z.object({
  aksi: z.string().min(1, 'Aksi tidak boleh kosong').trim().optional(),
  deskripsi: z.string().optional(),
});