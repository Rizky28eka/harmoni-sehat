import { z } from 'zod';

export const createMediaSchema = z.object({
  model_type: z.string().min(1, 'Tipe model tidak boleh kosong').trim(),
  model_id: z.string().min(1, 'ID model tidak boleh kosong'),
  url: z.string().url('URL tidak valid').min(1, 'URL tidak boleh kosong').trim(),
  mime_type: z.string().min(1, 'Tipe MIME tidak boleh kosong').trim(),
  size: z.number().min(0, 'Ukuran tidak boleh negatif'),
});

export const updateMediaSchema = z.object({
  url: z.string().url('URL tidak valid').min(1, 'URL tidak boleh kosong').trim().optional(),
  mime_type: z.string().min(1, 'Tipe MIME tidak boleh kosong').trim().optional(),
  size: z.number().min(0, 'Ukuran tidak boleh negatif').optional(),
});