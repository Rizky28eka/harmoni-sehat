import { z } from 'zod';

export const createDoctorSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim(),
  nomor_str: z.string().min(1, 'Nomor STR tidak boleh kosong').trim(),
  spesialisasi_id: z.string().optional(),
  biaya_konsultasi: z.number().min(0, 'Biaya konsultasi tidak boleh negatif'),
  foto: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateDoctorSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong').optional(),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim().optional(),
  nomor_str: z.string().min(1, 'Nomor STR tidak boleh kosong').trim().optional(),
  spesialisasi_id: z.string().optional(),
  biaya_konsultasi: z.number().min(0, 'Biaya konsultasi tidak boleh negatif').optional(),
  foto: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});