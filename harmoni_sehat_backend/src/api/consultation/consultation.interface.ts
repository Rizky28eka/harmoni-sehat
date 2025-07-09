import { Types } from 'mongoose';
import { IConsultation } from '../../models/Consultation';

export interface CreateConsultationDto {
  patient_id: string; // Will be ObjectId in service
  doctor_id: string; // Will be ObjectId in service
  schedule_id: string; // Will be ObjectId in service
  tanggal: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export interface UpdateConsultationDto {
  patient_id?: string;
  doctor_id?: string;
  schedule_id?: string;
  tanggal?: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan?: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export interface IConsultationResponseDto {
  id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  tanggal: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toConsultationResponseDto = (consultation: IConsultation): IConsultationResponseDto => {
  return {
    id: consultation._id.toString(),
    patient_id: consultation.patient_id.toString(),
    doctor_id: consultation.doctor_id.toString(),
    schedule_id: consultation.schedule_id.toString(),
    tanggal: consultation.tanggal,
    status: consultation.status,
    keluhan: consultation.keluhan,
    diagnosa: consultation.diagnosa,
    tindakan: consultation.tindakan,
    catatan_dokter: consultation.catatan_dokter,
    video_call_url: consultation.video_call_url,
    createdAt: consultation.createdAt,
    updatedAt: consultation.updatedAt,
  };
};
