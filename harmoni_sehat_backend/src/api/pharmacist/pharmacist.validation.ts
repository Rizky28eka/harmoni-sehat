import { z } from 'zod';

export const createPharmacistSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim(),
  nomor_sipa: z.string().min(1, 'Nomor SIPA tidak boleh kosong').trim(),
});

export const updatePharmacistSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong').optional(),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim().optional(),
  nomor_sipa: z.string().min(1, 'Nomor SIPA tidak boleh kosong').trim().optional(),
});