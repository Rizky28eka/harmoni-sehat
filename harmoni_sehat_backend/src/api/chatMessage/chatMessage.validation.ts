import { z } from 'zod';

export const createChatMessageSchema = z.object({
  konsultasi_id: z.string().min(1, 'Konsultasi ID tidak boleh kosong'),
  pengirim_id: z.string().min(1, 'Pengirim ID tidak boleh kosong'),
  isi: z.string().min(1, 'Isi pesan tidak boleh kosong').trim(),
  tipe: z.enum(['text', 'image', 'file'], { message: 'Tipe pesan tidak valid' }),
  file_url: z.string().optional(),
  is_read: z.boolean().optional(),
});

export const updateChatMessageSchema = z.object({
  isi: z.string().min(1, 'Isi pesan tidak boleh kosong').trim().optional(),
  tipe: z.enum(['text', 'image', 'file'], { message: 'Tipe pesan tidak valid' }).optional(),
  file_url: z.string().optional(),
  is_read: z.boolean().optional(),
});