"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("../utils/AppError");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        const errors = error.errors.map((err) => err.message);
        next(new AppError_1.AppError(errors.join(', '), 400));
    }
};
exports.validate = validate;
