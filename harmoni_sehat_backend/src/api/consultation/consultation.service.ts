import Consultation, { IConsultation } from '../../models/Consultation';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateConsultationInput, UpdateConsultationInput } from './consultation.validation';
import Patient from '../../models/Patient';
import Doctor from '../../models/Doctor';

class ConsultationService {
  async createConsultation(consultationData: CreateConsultationInput): Promise<IConsultation> {
    // Basic validation for patient_id, doctor_id, schedule_id existence
    if (!Types.ObjectId.isValid(consultationData.patient_id)) {
      throw new AppError('Invalid Patient ID', 400);
    }
    if (!Types.ObjectId.isValid(consultationData.doctor_id)) {
      throw new AppError('Invalid Doctor ID', 400);
    }
    if (!Types.ObjectId.isValid(consultationData.schedule_id)) {
      throw new AppError('Invalid Schedule ID', 400);
    }

    // Check if patient and doctor exist
    const patient = await Patient.findById(consultationData.patient_id);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    const doctor = await Doctor.findById(consultationData.doctor_id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const newConsultation = await Consultation.create(consultationData);
    return newConsultation;
  }

  async getAllConsultations(): Promise<IConsultation[]> {
    return Consultation.find().populate('patient_id').populate('doctor_id').populate('schedule_id');
  }

  async getConsultationById(consultationId: string): Promise<IConsultation | null> {
    if (!Types.ObjectId.isValid(consultationId)) {
      throw new AppError('Invalid Consultation ID', 400);
    }
    const consultation = await Consultation.findById(consultationId).populate('patient_id').populate('doctor_id').populate('schedule_id');
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }
    return consultation;
  }

  async getMyConsultations(userId: string): Promise<IConsultation[]> {
    // Find patient profile for the user
    const patient = await Patient.findOne({ user_id: userId });
    if (patient) {
      return Consultation.find({ patient_id: patient._id }).populate('patient_id').populate('doctor_id').populate('schedule_id');
    }

    // Find doctor profile for the user
    const doctor = await Doctor.findOne({ user_id: userId });
    if (doctor) {
      return Consultation.find({ doctor_id: doctor._id }).populate('patient_id').populate('doctor_id').populate('schedule_id');
    }

    return []; // No consultations found for this user
  }

  async updateConsultation(consultationId: string, consultationData: UpdateConsultationInput): Promise<IConsultation | null> {
    if (!Types.ObjectId.isValid(consultationId)) {
      throw new AppError('Invalid Consultation ID', 400);
    }
    const consultation = await Consultation.findByIdAndUpdate(consultationId, consultationData, { new: true, runValidators: true });
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }
    return consultation;
  }

  async deleteConsultation(consultationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(consultationId)) {
      throw new AppError('Invalid Consultation ID', 400);
    }
    const consultation = await Consultation.findByIdAndDelete(consultationId);
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }
  }
}

export default new ConsultationService();
