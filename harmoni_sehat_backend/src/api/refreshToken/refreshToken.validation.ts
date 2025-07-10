import { z } from 'zod';

export const createRefreshTokenSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  token: z.string().min(1, 'Token tidak boleh kosong').trim(),
  expired_at: z.string().datetime('Format tanggal kedaluwarsa tidak valid'),
});

export const updateRefreshTokenSchema = z.object({
  token: z.string().min(1, 'Token tidak boleh kosong').trim().optional(),
  expired_at: z.string().datetime('Format tanggal kedaluwarsa tidak valid').optional(),
});