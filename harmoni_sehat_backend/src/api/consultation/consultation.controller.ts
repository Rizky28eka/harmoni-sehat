import { Request, Response, NextFunction } from 'express';
import ConsultationService from './consultation.service';
import ApiResponse from '../../utils/ApiResponse';
import AppError from '../../utils/AppError';
import { toConsultationResponseDto } from './consultation.interface';
import { CreateConsultationInput, UpdateConsultationInput } from './consultation.validation';
import Patient from '../../models/Patient';
import Doctor from '../../models/Doctor';

class ConsultationController {
  async createConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationData: CreateConsultationInput = req.body;
      const userId = req.user?._id; // Get user ID from logged in user

      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }

      // Ownership check: If patient, ensure patient_id matches logged-in user's patient profile
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: userId });
        if (!patientProfile || patientProfile._id.toString() !== consultationData.patient_id) {
          return next(new AppError('Patients can only create consultations for themselves.', 403));
        }
      }

      const newConsultation = await ConsultationService.createConsultation(consultationData);
      res.status(201).json(new ApiResponse(201, toConsultationResponseDto(newConsultation), 'Consultation created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const consultations = await ConsultationService.getAllConsultations();
      res.status(200).json(new ApiResponse(200, consultations.map(toConsultationResponseDto), 'Consultations fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getConsultationById(req: Request, res: Response, next: NextFunction) {
    try {
      const consultation = await ConsultationService.getConsultationById(req.params.id);

      // Ownership authorization: Patient/Doctor can only access their own consultations
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || consultation?.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this consultation.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || consultation?.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to access this consultation.', 403));
        }
      }

      res.status(200).json(new ApiResponse(200, toConsultationResponseDto(consultation!), 'Consultation fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id; // Get user ID from logged in user
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      const consultations = await ConsultationService.getMyConsultations(userId.toString());
      res.status(200).json(new ApiResponse(200, consultations.map(toConsultationResponseDto), 'My consultations fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationData: UpdateConsultationInput = req.body;
      const consultationId = req.params.id; // ID of the consultation to update

      // Get the consultation first to check ownership
      const existingConsultation = await ConsultationService.getConsultationById(consultationId);
      if (!existingConsultation) {
        return next(new AppError('Consultation not found', 404));
      }

      // Ownership authorization: Patient/Doctor can only update their own consultations
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || existingConsultation.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this consultation.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || existingConsultation.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to update this consultation.', 403));
        }
      }

      const updatedConsultation = await ConsultationService.updateConsultation(consultationId, consultationData);
      res.status(200).json(new ApiResponse(200, toConsultationResponseDto(updatedConsultation!), 'Consultation updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationId = req.params.id; // ID of the consultation to delete

      // Get the consultation first to check ownership
      const existingConsultation = await ConsultationService.getConsultationById(consultationId);
      if (!existingConsultation) {
        return next(new AppError('Consultation not found', 404));
      }

      // Ownership authorization: Patient/Doctor can only delete their own consultations
      if (req.user?.roles?.includes('patient')) {
        const patientProfile = await Patient.findOne({ user_id: req.user._id });
        if (!patientProfile || existingConsultation.patient_id.toString() !== patientProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this consultation.', 403));
        }
      } else if (req.user?.roles?.includes('doctor')) {
        const doctorProfile = await Doctor.findOne({ user_id: req.user._id });
        if (!doctorProfile || existingConsultation.doctor_id.toString() !== doctorProfile._id.toString()) {
          return next(new AppError('You are not authorized to delete this consultation.', 403));
        }
      }

      await ConsultationService.deleteConsultation(consultationId);
      res.status(204).json(new ApiResponse(204, null, 'Consultation deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ConsultationController();
