import DoctorClinic, { IDoctorClinic } from '../../models/DoctorClinic';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDoctorClinicInput, UpdateDoctorClinicInput } from './doctorClinic.validation';
import Doctor from '../../models/Doctor';
import Clinic from '../../models/Clinic';

class DoctorClinicService {
  async createDoctorClinic(doctorClinicData: CreateDoctorClinicInput): Promise<IDoctorClinic> {
    // Check if doctor and clinic exist
    const doctor = await Doctor.findById(doctorClinicData.doctor_id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
    const clinic = await Clinic.findById(doctorClinicData.clinic_id);
    if (!clinic) {
      throw new AppError('Clinic not found', 404);
    }

    // Check for existing association
    const existingAssociation = await DoctorClinic.findOne({
      doctor_id: doctorClinicData.doctor_id,
      clinic_id: doctorClinicData.clinic_id,
    });
    if (existingAssociation) {
      throw new AppError('Doctor is already associated with this clinic', 409);
    }

    const newDoctorClinic = await DoctorClinic.create(doctorClinicData);
    return newDoctorClinic;
  }

  async getAllDoctorClinics(): Promise<IDoctorClinic[]> {
    return DoctorClinic.find().populate('doctor_id').populate('clinic_id');
  }

  async getDoctorClinicById(doctorClinicId: string): Promise<IDoctorClinic | null> {
    if (!Types.ObjectId.isValid(doctorClinicId)) {
      throw new AppError('Invalid Doctor Clinic ID', 400);
    }
    const doctorClinic = await DoctorClinic.findById(doctorClinicId).populate('doctor_id').populate('clinic_id');
    if (!doctorClinic) {
      throw new AppError('Doctor Clinic association not found', 404);
    }
    return doctorClinic;
  }

  async getDoctorClinicsByDoctorId(doctorId: string): Promise<IDoctorClinic[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new AppError('Invalid Doctor ID', 400);
    }
    return DoctorClinic.find({ doctor_id: doctorId }).populate('clinic_id');
  }

  async updateDoctorClinic(doctorClinicId: string, doctorClinicData: UpdateDoctorClinicInput): Promise<IDoctorClinic | null> {
    if (!Types.ObjectId.isValid(doctorClinicId)) {
      throw new AppError('Invalid Doctor Clinic ID', 400);
    }
    const doctorClinic = await DoctorClinic.findByIdAndUpdate(doctorClinicId, doctorClinicData, { new: true, runValidators: true });
    if (!doctorClinic) {
      throw new AppError('Doctor Clinic association not found', 404);
    }
    return doctorClinic;
  }

  async deleteDoctorClinic(doctorClinicId: string): Promise<void> {
    if (!Types.ObjectId.isValid(doctorClinicId)) {
      throw new AppError('Invalid Doctor Clinic ID', 400);
    }
    const doctorClinic = await DoctorClinic.findByIdAndDelete(doctorClinicId);
    if (!doctorClinic) {
      throw new AppError('Doctor Clinic association not found', 404);
    }
  }
}

export default new DoctorClinicService();
