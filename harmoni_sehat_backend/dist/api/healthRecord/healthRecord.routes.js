"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthRecord_controller_1 = __importDefault(require("./healthRecord.controller"));
const validator_1 = __importDefault(require("../../middlewares/validator"));
const router = (0, express_1.Router)();
router.get('/', healthRecord_controller_1.default.getAllHealthRecords);
router.get('/:id', healthRecord_controller_1.default.getHealthRecordById);
router.post('/', (0, validator_1.default)({}), healthRecord_controller_1.default.createHealthRecord); // Add actual schema here
router.put('/:id', (0, validator_1.default)({}), healthRecord_controller_1.default.updateHealthRecord); // Add actual schema here
router.delete('/:id', healthRecord_controller_1.default.deleteHealthRecord);
exports.default = router;
