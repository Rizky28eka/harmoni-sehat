import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createMedicalRecordSchema = z.object({
  body: z.object({
    patient_id: objectIdValidation,
    riwayat_penyakit: z.array(z.string()).optional(),
    alergi: z.array(z.string()).optional(),
    riwayat_vaksinasi: z.array(z.string()).optional(),
  }),
});

export const updateMedicalRecordSchema = z.object({
  body: z.object({
    riwayat_penyakit: z.array(z.string()).optional(),
    alergi: z.array(z.string()).optional(),
    riwayat_vaksinasi: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>['body'];
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>['body'];
