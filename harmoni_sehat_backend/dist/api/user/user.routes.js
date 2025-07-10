"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const validator_1 = require("../../middlewares/validator");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.route('/')
    .post((0, validator_1.validate)(user_validation_1.createUserSchema), user_controller_1.default.createUser)
    .get(user_controller_1.default.getAllUsers);
router.route('/:id')
    .get(user_controller_1.default.getUserById)
    .put((0, validator_1.validate)(user_validation_1.updateUserSchema), user_controller_1.default.updateUser)
    .delete(user_controller_1.default.deleteUser);
exports.default = router;
