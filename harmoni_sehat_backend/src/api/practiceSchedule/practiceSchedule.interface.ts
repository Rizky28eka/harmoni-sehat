import { Types } from 'mongoose';
import { IPracticeSchedule } from '../../models/PracticeSchedule';

export interface CreatePracticeScheduleDto {
  doctor_id: string; // Will be ObjectId in service
  clinic_id: string; // Will be ObjectId in service
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai: string;
  jam_selesai: string;
  is_active?: boolean;
}

export interface UpdatePracticeScheduleDto {
  doctor_id?: string;
  clinic_id?: string;
  hari?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai?: string;
  jam_selesai?: string;
  is_active?: boolean;
}

export interface IPracticeScheduleResponseDto {
  id: string;
  doctor_id: string;
  clinic_id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai: string;
  jam_selesai: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toPracticeScheduleResponseDto = (schedule: IPracticeSchedule): IPracticeScheduleResponseDto => {
  return {
    id: schedule._id.toString(),
    doctor_id: schedule.doctor_id.toString(),
    clinic_id: schedule.clinic_id.toString(),
    hari: schedule.hari,
    jam_mulai: schedule.jam_mulai,
    jam_selesai: schedule.jam_selesai,
    is_active: schedule.is_active,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
};
