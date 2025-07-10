import { z } from 'zod';

export const createPracticeScheduleSchema = z.object({
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong'),
  klinik_id: z.string().min(1, 'Klinik ID tidak boleh kosong'),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], { message: 'Hari tidak valid' }),
  jam_mulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam mulai harus HH:mm'),
  jam_selesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam selesai harus HH:mm'),
  is_active: z.boolean().optional(),
});

export const updatePracticeScheduleSchema = z.object({
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong').optional(),
  klinik_id: z.string().min(1, 'Klinik ID tidak boleh kosong').optional(),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], { message: 'Hari tidak valid' }).optional(),
  jam_mulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam mulai harus HH:mm').optional(),
  jam_selesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam selesai harus HH:mm').optional(),
  is_active: z.boolean().optional(),
});