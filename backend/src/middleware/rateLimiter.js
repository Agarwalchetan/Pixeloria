import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat-specific rate limiter (more lenient for real-time features)
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // Allow 120 requests per minute for chat operations
  message: {
    success: false,
    message: 'Chat rate limit exceeded. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for WebSocket upgrade requests
    return req.headers.upgrade === 'websocket';
  }
});

// Admin dashboard rate limiter
export const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Allow 200 requests per minute for admin operations
  message: {
    success: false,
    message: 'Admin rate limit exceeded. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Message sending rate limiter (prevent spam)
export const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Allow 30 messages per minute
  message: {
    success: false,
    message: 'Message rate limit exceeded. Please wait before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
