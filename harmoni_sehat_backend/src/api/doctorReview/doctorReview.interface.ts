import { Types } from 'mongoose';
import { IDoctorReview } from '../../models/DoctorReview';

export interface CreateDoctorReviewDto {
  pasien_id: string; // Will be ObjectId in service
  dokter_id: string; // Will be ObjectId in service
  konsultasi_id: string; // Will be ObjectId in service
  rating: number;
  komentar?: string;
}

export interface UpdateDoctorReviewDto {
  rating?: number;
  komentar?: string;
}

export interface IDoctorReviewResponseDto {
  id: string;
  pasien_id: string;
  dokter_id: string;
  konsultasi_id: string;
  rating: number;
  komentar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toDoctorReviewResponseDto = (doctorReview: any): IDoctorReviewResponseDto => {
  return {
    id: doctorReview._id.toString(),
    pasien_id: doctorReview.pasien_id.toString(),
    dokter_id: doctorReview.dokter_id.toString(),
    konsultasi_id: doctorReview.konsultasi_id.toString(),
    rating: doctorReview.rating,
    komentar: doctorReview.komentar,
    createdAt: doctorReview.createdAt,
    updatedAt: doctorReview.updatedAt,
  };
};
