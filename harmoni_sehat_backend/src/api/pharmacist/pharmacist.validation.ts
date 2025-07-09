import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createPharmacistSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim(),
    nomor_sipa: z.string().min(1, 'Nomor SIPA is required').trim(),
  }),
});

export const updatePharmacistSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    nomor_sipa: z.string().min(1, 'Nomor SIPA is required').trim().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreatePharmacistInput = z.infer<typeof createPharmacistSchema>['body'];
export type UpdatePharmacistInput = z.infer<typeof updatePharmacistSchema>['body'];
