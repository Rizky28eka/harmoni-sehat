import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

/**
 * Not Found handler middleware.
 * This middleware is triggered when no other route matches the incoming request.
 * It creates a 404 Not Found error and passes it to the next middleware (the global error handler).
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(createError(404, 'Resource not found on this server'));
};

export default notFoundHandler;