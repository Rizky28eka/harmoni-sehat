import Prescription, { IPrescription } from '../../models/Prescription';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreatePrescriptionInput, UpdatePrescriptionInput } from './prescription.validation';
import Consultation from '../../models/Consultation';
import Doctor from '../../models/Doctor';
import Patient from '../../models/Patient';

class PrescriptionService {
  async createPrescription(userId: string, prescriptionData: CreatePrescriptionInput): Promise<IPrescription> {
    // Check if consultation exists
    const consultation = await Consultation.findById(prescriptionData.consultation_id);
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }

    // Check if the user is the doctor for this consultation or an admin
    const doctor = await Doctor.findOne({ user_id: userId });
    if (!doctor || doctor._id.toString() !== consultation.doctor_id.toString()) {
      throw new AppError('You are not authorized to create a prescription for this consultation.', 403);
    }

    // Check if a prescription already exists for this consultation
    const existingPrescription = await Prescription.findOne({ consultation_id: prescriptionData.consultation_id });
    if (existingPrescription) {
      throw new AppError('A prescription already exists for this consultation', 409);
    }

    const newPrescription = await Prescription.create(prescriptionData);
    return newPrescription;
  }

  async getAllPrescriptions(): Promise<IPrescription[]> {
    return Prescription.find().populate({ path: 'consultation_id', populate: [{ path: 'patient_id' }, { path: 'doctor_id' }] });
  }

  async getPrescriptionById(prescriptionId: string): Promise<IPrescription | null> {
    if (!Types.ObjectId.isValid(prescriptionId)) {
      throw new AppError('Invalid Prescription ID', 400);
    }
    const prescription = await Prescription.findById(prescriptionId).populate({ path: 'consultation_id', populate: [{ path: 'patient_id' }, { path: 'doctor_id' }] });
    if (!prescription) {
      throw new AppError('Prescription not found', 404);
    }
    return prescription;
  }

  async getMyPrescriptions(userId: string): Promise<IPrescription[]> {
    const patient = await Patient.findOne({ user_id: userId });
    const doctor = await Doctor.findOne({ user_id: userId });

    if (patient) {
      // Get prescriptions where the logged-in user is the patient of the consultation
      const consultations = await Consultation.find({ patient_id: patient._id });
      const consultationIds = consultations.map(c => c._id);
      return Prescription.find({ consultation_id: { $in: consultationIds } }).populate({ path: 'consultation_id', populate: [{ path: 'patient_id' }, { path: 'doctor_id' }] });
    } else if (doctor) {
      // Get prescriptions where the logged-in user is the doctor of the consultation
      const consultations = await Consultation.find({ doctor_id: doctor._id });
      const consultationIds = consultations.map(c => c._id);
      return Prescription.find({ consultation_id: { $in: consultationIds } }).populate({ path: 'consultation_id', populate: [{ path: 'patient_id' }, { path: 'doctor_id' }] });
    }

    return [];
  }

  async updatePrescription(prescriptionId: string, prescriptionData: UpdatePrescriptionInput): Promise<IPrescription | null> {
    if (!Types.ObjectId.isValid(prescriptionId)) {
      throw new AppError('Invalid Prescription ID', 400);
    }
    const prescription = await Prescription.findByIdAndUpdate(prescriptionId, prescriptionData, { new: true, runValidators: true });
    if (!prescription) {
      throw new AppError('Prescription not found', 404);
    }
    return prescription;
  }

  async deletePrescription(prescriptionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(prescriptionId)) {
      throw new AppError('Invalid Prescription ID', 400);
    }
    const prescription = await Prescription.findByIdAndDelete(prescriptionId);
    if (!prescription) {
      throw new AppError('Prescription not found', 404);
    }
  }
}

export default new PrescriptionService();
