import { Types } from 'mongoose';
import { IDoctorReview } from '../../models/DoctorReview';

export interface CreateDoctorReviewDto {
  patient_id: string; // Will be ObjectId in service
  doctor_id: string; // Will be ObjectId in service
  consultation_id: string; // Will be ObjectId in service
  rating: number;
  komentar?: string;
}

export interface UpdateDoctorReviewDto {
  rating?: number;
  komentar?: string;
}

export interface IDoctorReviewResponseDto {
  id: string;
  patient_id: string;
  doctor_id: string;
  consultation_id: string;
  rating: number;
  komentar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toDoctorReviewResponseDto = (doctorReview: IDoctorReview): IDoctorReviewResponseDto => {
  return {
    id: doctorReview._id.toString(),
    patient_id: doctorReview.patient_id.toString(),
    doctor_id: doctorReview.doctor_id.toString(),
    consultation_id: doctorReview.consultation_id.toString(),
    rating: doctorReview.rating,
    komentar: doctorReview.komentar,
    createdAt: doctorReview.createdAt,
    updatedAt: doctorReview.updatedAt,
  };
};
