import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDoctorReviewSchema = z.object({
  body: z.object({
    patient_id: objectIdValidation,
    doctor_id: objectIdValidation,
    consultation_id: objectIdValidation,
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    komentar: z.string().optional(),
  }),
});

export const updateDoctorReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
    komentar: z.string().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDoctorReviewInput = z.infer<typeof createDoctorReviewSchema>['body'];
export type UpdateDoctorReviewInput = z.infer<typeof updateDoctorReviewSchema>['body'];
