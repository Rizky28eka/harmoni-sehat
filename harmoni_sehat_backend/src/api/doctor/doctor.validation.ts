import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDoctorSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim(),
    nomor_str: z.string().min(1, 'Nomor STR is required').trim(),
    specialization_id: objectIdValidation,
    biaya_konsultasi: z.number().min(0, 'Biaya konsultasi must be non-negative'),
    foto: z.string().url('Foto must be a valid URL').optional(),
    bio: z.string().optional(),
    status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    nomor_str: z.string().min(1, 'Nomor STR is required').trim().optional(),
    specialization_id: objectIdValidation.optional(),
    biaya_konsultasi: z.number().min(0, 'Biaya konsultasi must be non-negative').optional(),
    foto: z.string().url('Foto must be a valid URL').optional(),
    bio: z.string().optional(),
    status: z.enum(['active', 'inactive', 'pending']).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>['body'];
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>['body'];
