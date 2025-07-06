/**
 * Global Error Handler Middleware.
 * This middleware catches all errors that occur in the application.
 * It formats the error response into a consistent JSON structure.
 *
 * @param {object} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
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

module.exports = errorHandler;
