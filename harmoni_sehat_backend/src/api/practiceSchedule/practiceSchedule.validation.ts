import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createPracticeScheduleSchema = z.object({
  body: z.object({
    doctor_id: objectIdValidation,
    clinic_id: objectIdValidation,
    hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
    jam_mulai: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    jam_selesai: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    is_active: z.boolean().optional(),
  }),
});

export const updatePracticeScheduleSchema = z.object({
  body: z.object({
    doctor_id: objectIdValidation.optional(),
    clinic_id: objectIdValidation.optional(),
    hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']).optional(),
    jam_mulai: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
    jam_selesai: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
    is_active: z.boolean().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreatePracticeScheduleInput = z.infer<typeof createPracticeScheduleSchema>['body'];
export type UpdatePracticeScheduleInput = z.infer<typeof updatePracticeScheduleSchema>['body'];
