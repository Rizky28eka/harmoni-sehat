import { Types } from 'mongoose';
import { IHealthArticle } from '../../models/HealthArticle';

export interface CreateHealthArticleDto {
  judul: string;
  slug: string;
  konten: string;
  author_id: string; // Will be ObjectId in service
  author_type: 'Admin' | 'Doctor';
  status_publikasi?: 'draft' | 'published' | 'archived';
}

export interface UpdateHealthArticleDto {
  judul?: string;
  slug?: string;
  konten?: string;
  author_id?: string;
  author_type?: 'Admin' | 'Doctor';
  status_publikasi?: 'draft' | 'published' | 'archived';
}

export interface IHealthArticleResponseDto {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  author_id: string;
  author_type: 'Admin' | 'Doctor';
  status_publikasi: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export const toHealthArticleResponseDto = (article: IHealthArticle): IHealthArticleResponseDto => {
  return {
    id: article._id.toString(),
    judul: article.judul,
    slug: article.slug,
    konten: article.konten,
    author_id: article.author_id.toString(),
    author_type: article.author_type,
    status_publikasi: article.status_publikasi,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
