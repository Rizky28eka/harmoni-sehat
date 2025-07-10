import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email tidak valid').trim(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email tidak valid').trim().optional(),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
  is_active: z.boolean().optional(),
});
