import { Types } from 'mongoose';
import { IConsultation } from '../../models/Consultation';

export interface CreateConsultationDto {
  pasien_id: string; // Will be ObjectId in service
  dokter_id: string; // Will be ObjectId in service
  jadwal_id: string; // Will be ObjectId in service
  tanggal: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export interface UpdateConsultationDto {
  pasien_id?: string;
  dokter_id?: string;
  jadwal_id?: string;
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
  pasien_id: string;
  dokter_id: string;
  jadwal_id: string;
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

export const toConsultationResponseDto = (consultation: any): IConsultationResponseDto => {
  return {
    id: consultation._id.toString(),
    pasien_id: consultation.pasien_id.toString(),
    dokter_id: consultation.dokter_id.toString(),
    jadwal_id: consultation.jadwal_id.toString(),
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
