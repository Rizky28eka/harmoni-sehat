import { z } from 'zod';

export const createUserRoleSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  peran_id: z.string().min(1, 'Peran ID tidak boleh kosong'),
});

export const updateUserRoleSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong').optional(),
  peran_id: z.string().min(1, 'Peran ID tidak boleh kosong').optional(),
});