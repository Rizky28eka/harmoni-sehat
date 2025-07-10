import { z } from 'zod';

export const createDoctorReviewSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien ID tidak boleh kosong'),
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong'),
  konsultasi_id: z.string().min(1, 'Konsultasi ID tidak boleh kosong'),
  rating: z.number().min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5'),
  komentar: z.string().optional(),
});

export const updateDoctorReviewSchema = z.object({
  rating: z.number().min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5').optional(),
  komentar: z.string().optional(),
});