import { z } from 'zod';

export const createUserProfileSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  foto: z.string().optional(),
  bio: z.string().optional(),
});

export const updateUserProfileSchema = z.object({
  foto: z.string().optional(),
  bio: z.string().optional(),
});