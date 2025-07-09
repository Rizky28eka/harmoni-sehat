import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createPatientSchema = z.object({
  body: z.object({
    // user_id will come from req.user, not body
    nama: z.string().min(1, 'Nama is required').trim(),
    nik: z.string().length(16, 'NIK must be 16 characters').trim(),
    tanggal_lahir: z.string().datetime('Invalid date format').transform((str) => new Date(str)),
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], { message: 'Jenis kelamin must be Laki-laki or Perempuan' }),
    alamat: z.string().min(1, 'Alamat is required').trim(),
    no_telepon: z.string().min(10, 'Nomor telepon must be at least 10 digits').trim(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    nik: z.string().length(16, 'NIK must be 16 characters').trim().optional(),
    tanggal_lahir: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], { message: 'Jenis kelamin must be Laki-laki or Perempuan' }).optional(),
    alamat: z.string().min(1, 'Alamat is required').trim().optional(),
    no_telepon: z.string().min(10, 'Nomor telepon must be at least 10 digits').trim().optional(),
  }).partial(), // Allow partial updates
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>['body'];
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>['body'];
