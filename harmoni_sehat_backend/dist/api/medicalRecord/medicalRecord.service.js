"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MedicalRecord_1 = __importDefault(require("../../models/MedicalRecord"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const mongoose_1 = require("mongoose");
class MedicalRecordService {
    async getAllMedicalRecords() {
        return MedicalRecord_1.default.find().populate('patient_id');
    }
    async getMedicalRecordById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default('Invalid Medical Record ID', 400);
        }
        const record = await MedicalRecord_1.default.findById(id).populate('patient_id');
        if (!record) {
            throw new AppError_1.default('Medical Record not found', 404);
        }
        return record;
    }
    async createMedicalRecord(recordData) {
        if (!mongoose_1.Types.ObjectId.isValid(recordData.patient_id)) {
            throw new AppError_1.default('Invalid Pasien ID', 400);
        }
        const newRecord = await MedicalRecord_1.default.create(recordData);
        return newRecord;
    }
    async updateMedicalRecord(id, recordData) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default('Invalid Medical Record ID', 400);
        }
        const record = await MedicalRecord_1.default.findByIdAndUpdate(id, recordData, { new: true, runValidators: true });
        if (!record) {
            throw new AppError_1.default('Medical Record not found', 404);
        }
        return record;
    }
    async deleteMedicalRecord(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default('Invalid Medical Record ID', 400);
        }
        const record = await MedicalRecord_1.default.findByIdAndDelete(id);
        if (!record) {
            throw new AppError_1.default('Medical Record not found', 404);
        }
    }
}
exports.default = new MedicalRecordService();
