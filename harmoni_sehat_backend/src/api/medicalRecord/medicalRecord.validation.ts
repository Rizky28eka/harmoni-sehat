import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien ID tidak boleh kosong'),
  riwayat_penyakit: z.string().optional(),
  alergi: z.string().optional(),
  riwayat_vaksinasi: z.string().optional(),
});

export const updateMedicalRecordSchema = z.object({
  riwayat_penyakit: z.string().optional(),
  alergi: z.string().optional(),
  riwayat_vaksinasi: z.string().optional(),
});