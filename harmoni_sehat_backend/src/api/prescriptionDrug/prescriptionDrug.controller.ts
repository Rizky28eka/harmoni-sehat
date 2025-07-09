import { Request, Response, NextFunction } from 'express';
import PrescriptionDrugService from './prescriptionDrug.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toPrescriptionDrugResponseDto } from './prescriptionDrug.interface';
import { CreatePrescriptionDrugInput, UpdatePrescriptionDrugInput } from './prescriptionDrug.validation';
import Prescription from '../../models/Prescription';
import Consultation from '../../models/Consultation';
import Patient from '../../models/Patient';
import Doctor from '../../models/Doctor';

class PrescriptionDrugController {
  async createPrescriptionDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrugData: CreatePrescriptionDrugInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      const newPrescriptionDrug = await PrescriptionDrugService.createPrescriptionDrug(userId.toString(), prescriptionDrugData);
      res.status(201).json(new ApiResponse(201, toPrescriptionDrugResponseDto(newPrescriptionDrug), 'Prescription drug created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPrescriptionDrugs(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrugs = await PrescriptionDrugService.getAllPrescriptionDrugs();
      res.status(200).json(new ApiResponse(200, prescriptionDrugs.map(toPrescriptionDrugResponseDto), 'Prescription drugs fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPrescriptionDrugById(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrug = await PrescriptionDrugService.getPrescriptionDrugById(req.params.id);

      // Ownership authorization: Patient/Doctor can only access their own prescription drugs
      const prescription = await Prescription.findById(prescriptionDrug?.prescription_id);
      if (!prescription) {
        return next(new AppError('Prescription not found for this drug.', 404));
      }
      const consultation = await Consultation.findById(prescription.consultation_id);
      if (!consultation) {
        return next(new AppError('Consultation not found for this prescription.', 404));
      }

      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || consultation.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this prescription drug.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || consultation.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this prescription drug.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toPrescriptionDrugResponseDto(prescriptionDrug!), 'Prescription drug fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getPrescriptionDrugsByPrescriptionId(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionId = req.params.prescriptionId;

      // Ownership authorization: Patient/Doctor can only access their own prescription drugs
      const prescription = await Prescription.findById(prescriptionId);
      if (!prescription) {
        return next(new AppError('Prescription not found.', 404));
      }
      const consultation = await Consultation.findById(prescription.consultation_id);
      if (!consultation) {
        return next(new AppError('Consultation not found for this prescription.', 404));
      }

      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || consultation.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to access these prescription drugs.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || consultation.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to access these prescription drugs.', 403));
        }
      }

      const prescriptionDrugs = await PrescriptionDrugService.getPrescriptionDrugsByPrescriptionId(prescriptionId);
      res.status(200).json(new ApiResponse(200, prescriptionDrugs.map(toPrescriptionDrugResponseDto), 'Prescription drugs fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updatePrescriptionDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrugData: UpdatePrescriptionDrugInput = req.body;
      const prescriptionDrugId = req.params.id; // ID of the prescription drug to update

      // Get the prescription drug first to check ownership
      const existingPrescriptionDrug = await PrescriptionDrugService.getPrescriptionDrugById(prescriptionDrugId);
      if (!existingPrescriptionDrug) {
        return next(new AppError('Prescription drug not found', 404));
      }

      // Ownership authorization: Patient/Doctor can only update their own prescription drugs
      const prescription = await Prescription.findById(existingPrescriptionDrug.prescription_id);
      if (!prescription) {
        return next(new AppError('Prescription not found for this drug.', 404));
      }
      const consultation = await Consultation.findById(prescription.consultation_id);
      if (!consultation) {
        return next(new AppError('Consultation not found for this prescription.', 404));
      }

      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || consultation.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this prescription drug.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || consultation.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this prescription drug.', 403));
        }
      }

      const updatedPrescriptionDrug = await PrescriptionDrugService.updatePrescriptionDrug(req.user!._id.toString(), prescriptionDrugId, prescriptionDrugData);
      res.status(200).json(new ApiResponse(200, toPrescriptionDrugResponseDto(updatedPrescriptionDrug!), 'Prescription drug updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deletePrescriptionDrug(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptionDrugId = req.params.id; // ID of the prescription drug to delete

      // Get the prescription drug first to check ownership
      const existingPrescriptionDrug = await PrescriptionDrugService.getPrescriptionDrugById(prescriptionDrugId);
      if (!existingPrescriptionDrug) {
        return next(new AppError('Prescription drug not found', 404));
      }

      // Ownership authorization: Patient/Doctor can only delete their own prescription drugs
      const prescription = await Prescription.findById(existingPrescriptionDrug.prescription_id);
      if (!prescription) {
        return next(new AppError('Prescription not found for this drug.', 404));
      }
      const consultation = await Consultation.findById(prescription.consultation_id);
      if (!consultation) {
        return next(new AppError('Consultation not found for this prescription.', 404));
      }

      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || consultation.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this prescription drug.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || consultation.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this prescription drug.', 403));
        }
      }

      await PrescriptionDrugService.deletePrescriptionDrug(req.user!._id.toString(), prescriptionDrugId);
      res.status(204).json(new ApiResponse(204, null, 'Prescription drug deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PrescriptionDrugController();
