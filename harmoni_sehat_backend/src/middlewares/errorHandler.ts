import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware.
 * This middleware catches all errors that occur in the application.
 * It formats the error response into a consistent JSON structure.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    // Set a default status code if one is not already set
    const statusCode = err.statusCode || 500;

    // Send a formatted JSON response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error',
        // Optionally, include the stack trace in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default errorHandler;
