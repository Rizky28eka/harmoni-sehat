
import { Document, Types } from 'mongoose';
import { IDoctorReview as IDoctorReviewModel } from '../../models/DoctorReview';

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
  tanggal_ulasan: Date;
}

export const toDoctorReviewResponseDto = (doctorReview: IDoctorReviewModel): IDoctorReviewResponseDto => ({
  id: (doctorReview._id as Types.ObjectId).toString(),
  pasien_id: doctorReview.pasien_id.toString(),
  dokter_id: doctorReview.dokter_id.toString(),
  konsultasi_id: (doctorReview.konsultasi_id as Types.ObjectId).toString(),
  rating: doctorReview.rating,
  komentar: doctorReview.komentar,
  tanggal_ulasan: doctorReview.createdAt,
});
