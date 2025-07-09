"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HealthRecord_1 = __importDefault(require("../../models/HealthRecord"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const mongoose_1 = require("mongoose");
class HealthRecordService {
    async getAllHealthRecords() {
        return HealthRecord_1.default.find().populate('userId');
    }
    async getHealthRecordById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default('Invalid Health Record ID', 400);
        }
        const record = await HealthRecord_1.default.findById(id).populate('userId');
        if (!record) {
            throw new AppError_1.default('Health Record not found', 404);
        }
        return record;
    }
    async createHealthRecord(recordData) {
        if (!mongoose_1.Types.ObjectId.isValid(recordData.userId)) {
            throw new AppError_1.default('Invalid User ID', 400);
        }
        const newRecord = await HealthRecord_1.default.create(recordData);
        return newRecord;
    }
    async updateHealthRecord(id, recordData) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default('Invalid Health Record ID', 400);
        }
        const record = await HealthRecord_1.default.findByIdAndUpdate(id, recordData, { new: true, runValidators: true });
        if (!record) {
            throw new AppError_1.default('Health Record not found', 404);
        }
        return record;
    }
    async deleteHealthRecord(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.default('Invalid Health Record ID', 400);
        }
        const record = await HealthRecord_1.default.findByIdAndDelete(id);
        if (!record) {
            throw new AppError_1.default('Health Record not found', 404);
        }
    }
}
exports.default = new HealthRecordService();
