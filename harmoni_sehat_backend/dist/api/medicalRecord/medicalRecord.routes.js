"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalRecord_controller_1 = __importDefault(require("./medicalRecord.controller"));
const validator_1 = require("../../middlewares/validator");
const medicalRecord_validation_1 = require("./medicalRecord.validation");
const router = (0, express_1.Router)();
router.route('/')
    .post((0, validator_1.validate)(medicalRecord_validation_1.createMedicalRecordSchema), medicalRecord_controller_1.default.createMedicalRecord)
    .get(medicalRecord_controller_1.default.getAllMedicalRecords);
router.route('/:id')
    .get(medicalRecord_controller_1.default.getMedicalRecordById)
    .put((0, validator_1.validate)(medicalRecord_validation_1.updateMedicalRecordSchema), medicalRecord_controller_1.default.updateMedicalRecord)
    .delete(medicalRecord_controller_1.default.deleteMedicalRecord);
exports.default = router;
