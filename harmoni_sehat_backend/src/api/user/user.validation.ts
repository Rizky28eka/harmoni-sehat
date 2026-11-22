import { z } from 'zod';

const strongPassword = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
  .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
  .regex(/\d/, 'Password harus mengandung angka')
  .regex(/[@$!%*?&]/, 'Password harus mengandung karakter spesial (@$!%*?&)');

export const createUserSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: strongPassword,
  role: z.enum(['pasien', 'dokter', 'farmasi', 'admin']),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email tidak valid').optional(),
  is_active: z.boolean().optional(),
  role: z.enum(['pasien', 'dokter', 'farmasi', 'admin']).optional(),
});
