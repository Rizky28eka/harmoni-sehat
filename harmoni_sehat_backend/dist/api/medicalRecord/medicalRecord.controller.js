"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medicalRecord_service_1 = __importDefault(require("./medicalRecord.service"));
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const medicalRecord_interface_1 = require("./medicalRecord.interface");
class MedicalRecordController {
    // Renamed from getAllMedicalRecords to getMyMedicalRecord
    async getMyMedicalRecord(req, res, next) {
        try {
            // The user ID should come from the protect middleware
            const patientId = req.user?._id;
            const record = await medicalRecord_service_1.default.getMyMedicalRecord(patientId.toString());
            res.status(200).json(new ApiResponse_1.default(200, record ? (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(record) : null, 'Medical record fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async getMedicalRecordById(req, res, next) {
        try {
            const record = await medicalRecord_service_1.default.getMedicalRecordById(req.params.id);
            // Ownership authorization: Patient can only access their own record
            if (req.user?.roles?.includes('patient') && record?.patient_id.toString() !== req.user._id.toString()) {
                return next(new AppError_1.default('You are not authorized to access this medical record.', 403));
            }
            res.status(200).json(new ApiResponse_1.default(200, (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(record), 'Medical record fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async createMedicalRecord(req, res, next) {
        try {
            const recordData = req.body;
            const patientId = req.user?._id; // Get patient ID from logged in user
            if (!patientId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            // Ensure patient role can only create for themselves
            if (req.user?.roles?.includes('patient') && patientId.toString() !== req.user._id.toString()) {
                return next(new AppError_1.default('Patients can only create medical records for themselves.', 403));
            }
            const newRecord = await medicalRecord_service_1.default.createMedicalRecord(patientId.toString(), recordData);
            res.status(201).json(new ApiResponse_1.default(201, (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(newRecord), 'Medical record created successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async updateMedicalRecord(req, res, next) {
        try {
            const recordData = req.body;
            // Get the record first to check ownership
            const existingRecord = await medicalRecord_service_1.default.getMedicalRecordById(req.params.id);
            if (!existingRecord) {
                return next(new AppError_1.default('Medical Record not found', 404));
            }
            // Ownership authorization: Patient can only update their own record
            if (req.user?.roles?.includes('patient') && existingRecord.patient_id.toString() !== req.user._id.toString()) {
                return next(new AppError_1.default('You are not authorized to update this medical record.', 403));
            }
            const updatedRecord = await medicalRecord_service_1.default.updateMedicalRecord(req.params.id, recordData);
            res.status(200).json(new ApiResponse_1.default(200, (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(updatedRecord), 'Medical record updated successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMedicalRecord(req, res, next) {
        try {
            // Get the record first to check ownership
            const existingRecord = await medicalRecord_service_1.default.getMedicalRecordById(req.params.id);
            if (!existingRecord) {
                return next(new AppError_1.default('Medical Record not found', 404));
            }
            // Ownership authorization: Patient can only delete their own record
            if (req.user?.roles?.includes('patient') && existingRecord.patient_id.toString() !== req.user._id.toString()) {
                return next(new AppError_1.default('You are not authorized to delete this medical record.', 403));
            }
            await medicalRecord_service_1.default.deleteMedicalRecord(req.params.id);
            res.status(204).json(new ApiResponse_1.default(204, null, 'Medical record deleted successfully'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new MedicalRecordController();
