import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createPrescriptionSchema = z.object({
  body: z.object({
    consultation_id: objectIdValidation,
    catatan: z.string().optional(),
    status: z.enum(['active', 'inactive', 'expired']).default('active'),
    expired_at: z.string().datetime('Invalid date format').transform((str) => new Date(str)),
  }),
});

export const updatePrescriptionSchema = z.object({
  body: z.object({
    catatan: z.string().optional(),
    status: z.enum(['active', 'inactive', 'expired']).optional(),
    expired_at: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>['body'];
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>['body'];
