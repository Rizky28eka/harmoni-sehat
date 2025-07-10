"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MedicalRecord_1 = __importDefault(require("../../models/MedicalRecord"));
const AppError_1 = require("../../utils/AppError");
class MedicalRecordService {
    async createMedicalRecord(data) {
        const existingRecord = await MedicalRecord_1.default.findOne({ pasien_id: data.pasien_id });
        if (existingRecord) {
            throw new AppError_1.AppError('Rekam medis untuk pasien ini sudah ada', 409);
        }
        const medicalRecord = await MedicalRecord_1.default.create(data);
        return medicalRecord;
    }
    async getAllMedicalRecords() {
        const medicalRecords = await MedicalRecord_1.default.find().populate('pasien_id');
        return medicalRecords;
    }
    async getMedicalRecordById(id) {
        const medicalRecord = await MedicalRecord_1.default.findById(id).populate('pasien_id');
        if (!medicalRecord) {
            throw new AppError_1.AppError('Rekam medis tidak ditemukan', 404);
        }
        return medicalRecord;
    }
    async updateMedicalRecord(id, data) {
        const medicalRecord = await MedicalRecord_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!medicalRecord) {
            throw new AppError_1.AppError('Rekam medis tidak ditemukan', 404);
        }
        return medicalRecord;
    }
    async deleteMedicalRecord(id) {
        const medicalRecord = await MedicalRecord_1.default.findByIdAndDelete(id);
        if (!medicalRecord) {
            throw new AppError_1.AppError('Rekam medis tidak ditemukan', 404);
        }
    }
}
exports.default = new MedicalRecordService();
