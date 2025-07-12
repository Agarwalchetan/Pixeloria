import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Validation error
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    error = {
      statusCode: 400,
      message: `Validation Error: ${message}`,
    };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token',
    };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expired',
    };
  }

  // Database error
  if (err.code === '23505') {
    error = {
      statusCode: 400,
      message: 'Duplicate field value entered',
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};