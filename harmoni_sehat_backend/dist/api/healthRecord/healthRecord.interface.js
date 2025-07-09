"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHealthRecordResponseDto = void 0;
const toHealthRecordResponseDto = (record) => {
    return {
        id: record._id.toString(),
        userId: record.userId.toString(),
        date: record.date,
        bloodPressure: record.bloodPressure,
        heartRate: record.heartRate,
        notes: record.notes,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
};
exports.toHealthRecordResponseDto = toHealthRecordResponseDto;
