"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalRecord_controller_1 = __importDefault(require("./medicalRecord.controller"));
const validator_1 = __importDefault(require("../../middlewares/validator"));
const router = (0, express_1.Router)();
router.get('/', medicalRecord_controller_1.default.getAllMedicalRecords);
router.get('/:id', medicalRecord_controller_1.default.getMedicalRecordById);
router.post('/', (0, validator_1.default)({}), medicalRecord_controller_1.default.createMedicalRecord); // Add actual schema here
router.put('/:id', (0, validator_1.default)({}), medicalRecord_controller_1.default.updateMedicalRecord); // Add actual schema here
router.delete('/:id', medicalRecord_controller_1.default.deleteMedicalRecord);
exports.default = router;
