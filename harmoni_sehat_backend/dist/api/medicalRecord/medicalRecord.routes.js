"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalRecord_controller_1 = __importDefault(require("./medicalRecord.controller"));
const validator_1 = __importDefault(require("../../middlewares/validator"));
const protect_1 = require("../../middlewares/protect");
const authorize_1 = require("../../middlewares/authorize");
const medicalRecord_validation_1 = require("./medicalRecord.validation");
const router = (0, express_1.Router)();
// All medical record routes are protected
router.use(protect_1.protect);
// Route for a patient to get their own medical record
router.get('/my-record', medicalRecord_controller_1.default.getMyMedicalRecord);
router.post('/', (0, authorize_1.authorize)('patient'), (0, validator_1.default)(medicalRecord_validation_1.createMedicalRecordSchema), medicalRecord_controller_1.default.createMedicalRecord);
// Routes for specific record by ID.
// NOTE: Ownership authorization will be handled in controller/service for patient role
router.get('/:id', (0, authorize_1.authorize)('admin', 'doctor', 'patient'), medicalRecord_controller_1.default.getMedicalRecordById);
router.put('/:id', (0, authorize_1.authorize)('admin', 'doctor', 'patient'), (0, validator_1.default)(medicalRecord_validation_1.updateMedicalRecordSchema), medicalRecord_controller_1.default.updateMedicalRecord);
router.delete('/:id', (0, authorize_1.authorize)('admin'), medicalRecord_controller_1.default.deleteMedicalRecord);
exports.default = router;
