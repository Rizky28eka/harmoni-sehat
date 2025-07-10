import { z } from 'zod';

export const createRoleSchema = z.object({
  nama_peran: z.string().min(1, 'Nama peran tidak boleh kosong').trim(),
});

export const updateRoleSchema = z.object({
  nama_peran: z.string().min(1, 'Nama peran tidak boleh kosong').trim().optional(),
});