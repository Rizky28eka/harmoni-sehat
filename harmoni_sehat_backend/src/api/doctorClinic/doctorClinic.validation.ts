import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDoctorClinicSchema = z.object({
  body: z.object({
    doctor_id: objectIdValidation,
    clinic_id: objectIdValidation,
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateDoctorClinicSchema = z.object({
  body: z.object({
    doctor_id: objectIdValidation.optional(),
    clinic_id: objectIdValidation.optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDoctorClinicInput = z.infer<typeof createDoctorClinicSchema>['body'];
export type UpdateDoctorClinicInput = z.infer<typeof updateDoctorClinicSchema>['body'];
