"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMedicalRecordResponseDto = void 0;
const toMedicalRecordResponseDto = (record) => ({
    id: record._id.toString(),
    pasien_id: record.pasien_id.toString(),
    tanggal_rekam_medis: record.tanggal_rekam_medis,
    diagnosis: record.diagnosis,
    catatan_dokter: record.catatan_dokter,
    resep_id: record.resep_id,
    riwayat_penyakit: record.riwayat_penyakit,
    alergi: record.alergi,
    tinggi_badan: record.tinggi_badan,
    berat_badan: record.berat_badan,
    tekanan_darah: record.tekanan_darah,
    suhu_tubuh: record.suhu_tubuh,
});
exports.toMedicalRecordResponseDto = toMedicalRecordResponseDto;
