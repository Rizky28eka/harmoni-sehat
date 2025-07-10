import { Types } from 'mongoose';
import { IHealthArticle } from '../../models/HealthArticle';

export interface CreateHealthArticleDto {
  judul: string;
  slug: string;
  konten: string;
  penulis_id: string; // Will be ObjectId in service
  status_publikasi?: 'draft' | 'published' | 'archived';
}

export interface UpdateHealthArticleDto {
  judul?: string;
  slug?: string;
  konten?: string;
  penulis_id?: string;
  status_publikasi?: 'draft' | 'published' | 'archived';
}

export interface IHealthArticleResponseDto {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  penulis_id: string;
  status_publikasi: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export const toHealthArticleResponseDto = (article: any): IHealthArticleResponseDto => {
  return {
    id: article._id.toString(),
    judul: article.judul,
    slug: article.slug,
    konten: article.konten,
    penulis_id: article.penulis_id.toString(),
    status_publikasi: article.status_publikasi,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
