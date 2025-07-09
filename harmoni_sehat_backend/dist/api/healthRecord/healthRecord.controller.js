"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const healthRecord_service_1 = __importDefault(require("./healthRecord.service"));
const healthRecord_interface_1 = require("./healthRecord.interface");
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
class HealthRecordController {
    async getAllHealthRecords(req, res, next) {
        try {
            const records = await healthRecord_service_1.default.getAllHealthRecords();
            res.status(200).json(new ApiResponse_1.default(200, records.map(healthRecord_interface_1.toHealthRecordResponseDto), 'Health records fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async getHealthRecordById(req, res, next) {
        try {
            const record = await healthRecord_service_1.default.getHealthRecordById(req.params.id);
            res.status(200).json(new ApiResponse_1.default(200, (0, healthRecord_interface_1.toHealthRecordResponseDto)(record), 'Health record fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async createHealthRecord(req, res, next) {
        try {
            const recordData = req.body;
            const newRecord = await healthRecord_service_1.default.createHealthRecord(recordData);
            res.status(201).json(new ApiResponse_1.default(201, (0, healthRecord_interface_1.toHealthRecordResponseDto)(newRecord), 'Health record created successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async updateHealthRecord(req, res, next) {
        try {
            const recordData = req.body;
            const updatedRecord = await healthRecord_service_1.default.updateHealthRecord(req.params.id, recordData);
            res.status(200).json(new ApiResponse_1.default(200, (0, healthRecord_interface_1.toHealthRecordResponseDto)(updatedRecord), 'Health record updated successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteHealthRecord(req, res, next) {
        try {
            await healthRecord_service_1.default.deleteHealthRecord(req.params.id);
            res.status(204).json(new ApiResponse_1.default(204, null, 'Health record deleted successfully'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new HealthRecordController();
