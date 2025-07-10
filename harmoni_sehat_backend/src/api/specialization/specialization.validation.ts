import { z } from 'zod';

export const createSpecializationSchema = z.object({
  nama: z.string().min(1, 'Nama spesialisasi tidak boleh kosong').trim(),
  deskripsi: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const updateSpecializationSchema = z.object({
  nama: z.string().min(1, 'Nama spesialisasi tidak boleh kosong').trim().optional(),
  deskripsi: z.string().optional(),
  is_active: z.boolean().optional(),
});