import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createConsultationSchema = z.object({
  body: z.object({
    patient_id: objectIdValidation,
    doctor_id: objectIdValidation,
    schedule_id: objectIdValidation,
    tanggal: z.string().datetime('Invalid date format').transform((str) => new Date(str)),
    status: z.enum(['scheduled', 'completed', 'cancelled', 'pending']).default('pending'),
    keluhan: z.string().min(1, 'Keluhan is required').trim(),
    diagnosa: z.string().optional(),
    tindakan: z.string().optional(),
    catatan_dokter: z.string().optional(),
    video_call_url: z.string().url('Video call URL must be a valid URL').optional(),
  }),
});

export const updateConsultationSchema = z.object({
  body: z.object({
    patient_id: objectIdValidation.optional(),
    doctor_id: objectIdValidation.optional(),
    schedule_id: objectIdValidation.optional(),
    tanggal: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
    status: z.enum(['scheduled', 'completed', 'cancelled', 'pending']).optional(),
    keluhan: z.string().min(1, 'Keluhan is required').trim().optional(),
    diagnosa: z.string().optional(),
    tindakan: z.string().optional(),
    catatan_dokter: z.string().optional(),
    video_call_url: z.string().url('Video call URL must be a valid URL').optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>['body'];
export type UpdateConsultationInput = z.infer<typeof updateConsultationSchema>['body'];
