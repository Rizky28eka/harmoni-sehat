const createError = require('http-errors');

/**
 * Not Found handler middleware.
 * This middleware is triggered when no other route matches the incoming request.
 * It creates a 404 Not Found error and passes it to the next middleware (the global error handler).
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Resource not found on this server'));
};

module.exports = notFoundHandler;
