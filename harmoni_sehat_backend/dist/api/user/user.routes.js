"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const validator_1 = __importDefault(require("../../middlewares/validator"));
// import { createUserSchema, updateUserSchema } from './user.validation'; // Assuming validation schemas
const router = (0, express_1.Router)();
router.get('/', user_controller_1.default.getAllUsers);
router.get('/:id', user_controller_1.default.getUserById);
router.post('/', (0, validator_1.default)({}), user_controller_1.default.createUser); // Add actual schema here
router.put('/:id', (0, validator_1.default)({}), user_controller_1.default.updateUser); // Add actual schema here
router.delete('/:id', user_controller_1.default.deleteUser);
exports.default = router;
