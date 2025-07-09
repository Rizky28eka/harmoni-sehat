import { Request, Response, NextFunction } from 'express';
import PrescriptionService from './prescription.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toPrescriptionResponseDto } from './prescription.interface';
import { CreatePrescriptionInput, UpdatePrescriptionInput } from './prescription.validation';
import Consultation from '../../models/Consultation';
import Doctor from '../../models/Doctor';
import Patient from '../../models/Patient';

class PrescriptionController {
  async createPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionData: CreatePrescriptionInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newPrescription = await PrescriptionService.createPrescription(userId.toString(), prescriptionData);
      res.status(201).json(new ApiResponse(201, toPrescriptionResponseDto(newPrescription), 'Prescription created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptions = await PrescriptionService.getAllPrescriptions();
      res.status(200).json(new ApiResponse(200, prescriptions.map(toPrescriptionResponseDto), 'Prescriptions fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPrescriptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await PrescriptionService.getPrescriptionById(req.params.id);

      // Ownership authorization: Patient/Doctor can only access their own prescriptions
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        const consultation = await Consultation.findById(prescription?.consultation_id);
        if (!patientProfile || consultation?.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this prescription.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        const consultation = await Consultation.findById(prescription?.consultation_id);
        if (!doctorProfile || consultation?.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this prescription.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toPrescriptionResponseDto(prescription!), 'Prescription fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const prescriptions = await PrescriptionService.getMyPrescriptions(userId.toString());
      res.status(200).json(new ApiResponse(200, prescriptions.map(toPrescriptionResponseDto), 'My prescriptions fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updatePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionData: UpdatePrescriptionInput = req.body;
      const prescriptionId = req.params.id; // ID of the prescription to update

      // Get the prescription first to check ownership
      const existingPrescription = await PrescriptionService.getPrescriptionById(prescriptionId);
      if (!existingPrescription) {
        return next(new AppError('Prescription not found', 404));
      }

      // Ownership authorization: Patient/Doctor can only update their own prescriptions
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        const consultation = await Consultation.findById(existingPrescription.consultation_id);
        if (!patientProfile || consultation?.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this prescription.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        const consultation = await Consultation.findById(existingPrescription.consultation_id);
        if (!doctorProfile || consultation?.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this prescription.', 403));
        }
      }

      const updatedPrescription = await PrescriptionService.updatePrescription(prescriptionId, prescriptionData);
      res.status(200).json(new ApiResponse(200, toPrescriptionResponseDto(updatedPrescription!), 'Prescription updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deletePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionId = req.params.id; // ID of the prescription to delete

      // Get the prescription first to check ownership
      const existingPrescription = await PrescriptionService.getPrescriptionById(prescriptionId);
      if (!existingPrescription) {
        return next(new AppError('Prescription not found', 404));
      }

      // Ownership authorization: Patient/Doctor can only delete their own prescriptions
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        const consultation = await Consultation.findById(existingPrescription.consultation_id);
        if (!patientProfile || consultation?.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this prescription.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        const consultation = await Consultation.findById(existingPrescription.consultation_id);
        if (!doctorProfile || consultation?.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this prescription.', 403));
        }
      }

      await PrescriptionService.deletePrescription(prescriptionId);
      res.status(204).json(new ApiResponse(204, null, 'Prescription deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PrescriptionController();
