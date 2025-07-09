"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medicalRecord_service_1 = __importDefault(require("./medicalRecord.service"));
const medicalRecord_interface_1 = require("./medicalRecord.interface");
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
class MedicalRecordController {
    async getAllMedicalRecords(req, res, next) {
        try {
            const records = await medicalRecord_service_1.default.getAllMedicalRecords();
            res.status(200).json(new ApiResponse_1.default(200, records.map(medicalRecord_interface_1.toMedicalRecordResponseDto), 'Medical records fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async getMedicalRecordById(req, res, next) {
        try {
            const record = await medicalRecord_service_1.default.getMedicalRecordById(req.params.id);
            res.status(200).json(new ApiResponse_1.default(200, (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(record), 'Medical record fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async createMedicalRecord(req, res, next) {
        try {
            const recordData = req.body;
            const newRecord = await medicalRecord_service_1.default.createMedicalRecord(recordData);
            res.status(201).json(new ApiResponse_1.default(201, (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(newRecord), 'Medical record created successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async updateMedicalRecord(req, res, next) {
        try {
            const recordData = req.body;
            const updatedRecord = await medicalRecord_service_1.default.updateMedicalRecord(req.params.id, recordData);
            res.status(200).json(new ApiResponse_1.default(200, (0, medicalRecord_interface_1.toMedicalRecordResponseDto)(updatedRecord), 'Medical record updated successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMedicalRecord(req, res, next) {
        try {
            await medicalRecord_service_1.default.deleteMedicalRecord(req.params.id);
            res.status(204).json(new ApiResponse_1.default(204, null, 'Medical record deleted successfully'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new MedicalRecordController();
