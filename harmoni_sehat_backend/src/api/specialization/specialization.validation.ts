import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createSpecializationSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim(),
    deskripsi: z.string().optional(),
    is_active: z.boolean().optional(),
  }),
});

export const updateSpecializationSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    deskripsi: z.string().optional(),
    is_active: z.boolean().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateSpecializationInput = z.infer<typeof createSpecializationSchema>['body'];
export type UpdateSpecializationInput = z.infer<typeof updateSpecializationSchema>['body'];
