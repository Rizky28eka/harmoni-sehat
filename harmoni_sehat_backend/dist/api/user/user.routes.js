"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const protect_1 = require("../../middlewares/protect");
const authorize_1 = require("../../middlewares/authorize");
const router = (0, express_1.Router)();
// All routes below this are now protected
router.use(protect_1.protect);
router.get('/', (0, authorize_1.authorize)('admin'), user_controller_1.default.getAllUsers);
router.get('/:id', (0, authorize_1.authorize)('admin'), user_controller_1.default.getUserById);
router.put('/:id', (0, authorize_1.authorize)('admin'), user_controller_1.default.updateUser);
router.delete('/:id', (0, authorize_1.authorize)('admin'), user_controller_1.default.deleteUser);
exports.default = router;
