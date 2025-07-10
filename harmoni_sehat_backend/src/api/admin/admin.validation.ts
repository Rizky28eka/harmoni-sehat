import { z } from 'zod';

export const createAdminSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim(),
});

export const updateAdminSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong').optional(),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim().optional(),
});