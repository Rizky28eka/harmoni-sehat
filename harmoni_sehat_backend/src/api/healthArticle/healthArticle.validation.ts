import { z } from 'zod';

export const createHealthArticleSchema = z.object({
  judul: z.string().min(1, 'Judul tidak boleh kosong').trim(),
  slug: z.string().min(1, 'Slug tidak boleh kosong').trim(),
  konten: z.string().min(1, 'Konten tidak boleh kosong').trim(),
  penulis_id: z.string().min(1, 'Penulis ID tidak boleh kosong'),
  status_publikasi: z.enum(['draft', 'published', 'archived']).optional(),
});

export const updateHealthArticleSchema = z.object({
  judul: z.string().min(1, 'Judul tidak boleh kosong').trim().optional(),
  slug: z.string().min(1, 'Slug tidak boleh kosong').trim().optional(),
  konten: z.string().min(1, 'Konten tidak boleh kosong').trim().optional(),
  penulis_id: z.string().min(1, 'Penulis ID tidak boleh kosong').optional(),
  status_publikasi: z.enum(['draft', 'published', 'archived']).optional(),
});