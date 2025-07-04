const ApiError = require('../utils/ApiError');

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern || { message: err.message })[0];
  const message = `Sudah ada data dengan ${field} yang sama.`;
  return new ApiError(409, message);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log untuk developer
  console.error('ERROR LOG:', {
    message: error.message,
    stack: error.stack,
    requestBody: req.body,
  });

  // Error duplikasi dari Knex/MySQL (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Email atau nomor HP sudah terdaftar.';
    error = new ApiError(409, message);
  }
  
  // Error kustom dari service
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Error lainnya yang tidak terduga
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server.',
  });
};

module.exports = errorHandler;
