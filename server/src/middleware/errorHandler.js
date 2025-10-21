// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  // Database errors
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Foreign key constraint violation',
      message: 'Referenced record does not exist'
    });
  }

  if (err.code === '42P01') {
    return res.status(500).json({
      error: 'Database table not found',
      message: 'The requested resource table does not exist'
    });
  }

  // Validation errors (from Joi)
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      message: err.details[0].message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please provide a valid authentication token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Your session has expired. Please log in again'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler for unknown routes
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Async wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};