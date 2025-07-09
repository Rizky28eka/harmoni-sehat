import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createAdminSchema = z.object({
  body: z.object({
    user_id: objectIdValidation,
    nama: z.string().min(1, 'Nama is required').trim(),
  }),
});

export const updateAdminSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>['body'];
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>['body'];
