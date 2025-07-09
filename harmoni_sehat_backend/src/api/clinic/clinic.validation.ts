import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createClinicSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim(),
    alamat: z.string().min(1, 'Alamat is required').trim(),
    no_telepon: z.string().min(10, 'Nomor telepon must be at least 10 digits').trim(),
    email: z.string().email('Invalid email format').trim(),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
});

export const updateClinicSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    alamat: z.string().min(1, 'Alamat is required').trim().optional(),
    no_telepon: z.string().min(10, 'Nomor telepon must be at least 10 digits').trim().optional(),
    email: z.string().email('Invalid email format').trim().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>['body'];
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>['body'];
