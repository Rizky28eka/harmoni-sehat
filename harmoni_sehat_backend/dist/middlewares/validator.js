"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("../utils/AppError");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        const errorMessages = JSON.parse(error.message).map((err) => err.message);
        return next(new AppError_1.AppError(errorMessages.join(', '), 400));
    }
};
exports.validate = validate;
