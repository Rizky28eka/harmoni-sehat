
import { Document, Types } from 'mongoose';
import { IHealthArticle as IHealthArticleModel } from '../../models/HealthArticle';

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

export const toHealthArticleResponseDto = (article: IHealthArticleModel): IHealthArticleResponseDto => ({
  id: (article._id as Types.ObjectId).toString(),
  judul: article.judul,
  slug: article.slug,
  konten: article.konten,
  penulis_id: (article.penulis_id as Types.ObjectId).toString(),
  status_publikasi: article.status_publikasi,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
});
