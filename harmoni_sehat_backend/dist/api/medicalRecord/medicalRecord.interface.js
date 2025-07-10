"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMedicalRecordResponseDto = void 0;
const toMedicalRecordResponseDto = (record) => {
    return {
        id: record._id.toString(),
        pasien_id: record.pasien_id.toString(),
        riwayat_penyakit: record.riwayat_penyakit,
        alergi: record.alergi,
        riwayat_vaksinasi: record.riwayat_vaksinasi,
        createdAt: record.createdAt,
        updatedAt: record.updatedT,
    };
};
exports.toMedicalRecordResponseDto = toMedicalRecordResponseDto;
