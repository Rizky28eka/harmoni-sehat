import { z } from 'zod';

export const createConsultationSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien ID tidak boleh kosong'),
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong'),
  jadwal_id: z.string().min(1, 'Jadwal ID tidak boleh kosong'),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled']).optional(),
  keluhan: z.string().min(1, 'Keluhan tidak boleh kosong').trim(),
  diagnosa: z.string().optional(),
  tindakan: z.string().optional(),
  catatan_dokter: z.string().optional(),
  video_call_url: z.string().optional(),
});

export const updateConsultationSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien ID tidak boleh kosong').optional(),
  dokter_id: z.string().min(1, 'Dokter ID tidak boleh kosong').optional(),
  jadwal_id: z.string().min(1, 'Jadwal ID tidak boleh kosong').optional(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').optional(),
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled']).optional(),
  keluhan: z.string().min(1, 'Keluhan tidak boleh kosong').trim().optional(),
  diagnosa: z.string().optional(),
  tindakan: z.string().optional(),
  catatan_dokter: z.string().optional(),
  video_call_url: z.string().optional(),
});