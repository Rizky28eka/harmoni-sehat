import { z } from 'zod';

export const createDoctorClinicSchema = z.object({
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong'),
  klinik_id: z.string().min(1, 'Klinik ID tidak boleh kosong'),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateDoctorClinicSchema = z.object({
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong').optional(),
  klinik_id: z.string().min(1, 'Klinik ID tidak boleh kosong').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});