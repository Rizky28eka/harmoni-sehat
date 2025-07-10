"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medicalRecord_service_1 = __importDefault(require("./medicalRecord.service"));
const ApiResponse_1 = require("../../utils/ApiResponse");
const AppError_1 = require("../../utils/AppError");
class MedicalRecordController {
    async createMedicalRecord(req, res, next) {
        try {
            const medicalRecord = await medicalRecord_service_1.default.createMedicalRecord(req.body);
            res.status(201).json(new ApiResponse_1.ApiResponse(201, medicalRecord, 'Rekam medis berhasil ditambahkan'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async getAllMedicalRecords(req, res, next) {
        try {
            const medicalRecords = await medicalRecord_service_1.default.getAllMedicalRecords();
            res.status(200).json(new ApiResponse_1.ApiResponse(200, medicalRecords, 'Daftar rekam medis berhasil diambil'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async getMedicalRecordById(req, res, next) {
        try {
            const medicalRecord = await medicalRecord_service_1.default.getMedicalRecordById(req.params.id);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, medicalRecord, 'Rekam medis berhasil ditemukan'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async updateMedicalRecord(req, res, next) {
        try {
            const medicalRecord = await medicalRecord_service_1.default.updateMedicalRecord(req.params.id, req.body);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, medicalRecord, 'Rekam medis berhasil diperbarui'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async deleteMedicalRecord(req, res, next) {
        try {
            await medicalRecord_service_1.default.deleteMedicalRecord(req.params.id);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Rekam medis berhasil dihapus'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
}
exports.default = new MedicalRecordController();
