import PrescriptionDrug, { IPrescriptionDrug } from '../../models/PrescriptionDrug';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreatePrescriptionDrugInput, UpdatePrescriptionDrugInput } from './prescriptionDrug.validation';
import Prescription from '../../models/Prescription';
import Drug from '../../models/Drug';
import Consultation from '../../models/Consultation';
import Patient from '../../models/Patient';
import Doctor from '../../models/Doctor';

class PrescriptionDrugService {
  async createPrescriptionDrug(userId: string, prescriptionDrugData: CreatePrescriptionDrugInput): Promise<IPrescriptionDrug> {
    // Check if prescription exists
    const prescription = await Prescription.findById(prescriptionDrugData.prescription_id);
    if (!prescription) {
      throw new AppError('Prescription not found', 404);
    }

    // Check if drug exists
    const drug = await Drug.findById(prescriptionDrugData.drug_id);
    if (!drug) {
      throw new AppError('Drug not found', 404);
    }

    // Authorization: Only the doctor who created the prescription or admin can add drugs to it
    const consultation = await Consultation.findById(prescription.consultation_id);
    if (!consultation) {
      throw new AppError('Consultation not found for this prescription', 404);
    }
    const doctorProfile = await Doctor.findOne({ user_id: userId });
    if (!doctorProfile || doctorProfile._id.toString() !== consultation.doctor_id.toString()) {
      throw new AppError('You are not authorized to add drugs to this prescription.', 403);
    }

    const newPrescriptionDrug = await PrescriptionDrug.create(prescriptionDrugData);
    return newPrescriptionDrug;
  }

  async getAllPrescriptionDrugs(): Promise<IPrescriptionDrug[]> {
    return PrescriptionDrug.find().populate('prescription_id').populate('drug_id');
  }

  async getPrescriptionDrugById(prescriptionDrugId: string): Promise<IPrescriptionDrug | null> {
    if (!Types.ObjectId.isValid(prescriptionDrugId)) {
      throw new AppError('Invalid Prescription Drug ID', 400);
    }
    const prescriptionDrug = await PrescriptionDrug.findById(prescriptionDrugId).populate('prescription_id').populate('drug_id');
    if (!prescriptionDrug) {
      throw new AppError('Prescription Drug not found', 404);
    }
    return prescriptionDrug;
  }

  async getPrescriptionDrugsByPrescriptionId(prescriptionId: string): Promise<IPrescriptionDrug[]> {
    if (!Types.ObjectId.isValid(prescriptionId)) {
      throw new AppError('Invalid Prescription ID', 400);
    }
    return PrescriptionDrug.find({ prescription_id: prescriptionId }).populate('drug_id');
  }

  async updatePrescriptionDrug(userId: string, prescriptionDrugId: string, prescriptionDrugData: UpdatePrescriptionDrugInput): Promise<IPrescriptionDrug | null> {
    if (!Types.ObjectId.isValid(prescriptionDrugId)) {
      throw new AppError('Invalid Prescription Drug ID', 400);
    }

    const existingPrescriptionDrug = await PrescriptionDrug.findById(prescriptionDrugId);
    if (!existingPrescriptionDrug) {
      throw new AppError('Prescription Drug not found', 404);
    }

    // Authorization: Only the doctor who created the prescription or admin can update drugs in it
    const prescription = await Prescription.findById(existingPrescriptionDrug.prescription_id);
    if (!prescription) {
      throw new AppError('Prescription not found for this drug', 404);
    }
    const consultation = await Consultation.findById(prescription.consultation_id);
    if (!consultation) {
      throw new AppError('Consultation not found for this prescription', 404);
    }
    const doctorProfile = await Doctor.findOne({ user_id: userId });
    if (!doctorProfile || doctorProfile._id.toString() !== consultation.doctor_id.toString()) {
      throw new AppError('You are not authorized to update drugs in this prescription.', 403);
    }

    const updatedPrescriptionDrug = await PrescriptionDrug.findByIdAndUpdate(prescriptionDrugId, prescriptionDrugData, { new: true, runValidators: true });
    if (!updatedPrescriptionDrug) {
      throw new AppError('Prescription Drug not found', 404);
    }
    return updatedPrescriptionDrug;
  }

  async deletePrescriptionDrug(userId: string, prescriptionDrugId: string): Promise<void> {
    if (!Types.ObjectId.isValid(prescriptionDrugId)) {
      throw new AppError('Invalid Prescription Drug ID', 400);
    }

    const existingPrescriptionDrug = await PrescriptionDrug.findById(prescriptionDrugId);
    if (!existingPrescriptionDrug) {
      throw new AppError('Prescription Drug not found', 404);
    }

    // Authorization: Only the doctor who created the prescription or admin can delete drugs from it
    const prescription = await Prescription.findById(existingPrescriptionDrug.prescription_id);
    if (!prescription) {
      throw new AppError('Prescription not found for this drug', 404);
    }
    const consultation = await Consultation.findById(prescription.consultation_id);
    if (!consultation) {
      throw new AppError('Consultation not found for this prescription', 404);
    }
    const doctorProfile = await Doctor.findOne({ user_id: userId });
    if (!doctorProfile || doctorProfile._id.toString() !== consultation.doctor_id.toString()) {
      throw new AppError('You are not authorized to delete drugs from this prescription.', 403);
    }

    const prescriptionDrug = await PrescriptionDrug.findByIdAndDelete(prescriptionDrugId);
    if (!prescriptionDrug) {
      throw new AppError('Prescription Drug not found', 404);
    }
  }
}

export default new PrescriptionDrugService();
