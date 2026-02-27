const rateLimit = require('express-rate-limit');

// Hint route pe — 10 requests per minute per IP
const hintRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: 'Too many hint requests. Please wait a minute before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Query execution pe — 30 requests per minute per IP
const queryRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Too many query requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  hintRateLimiter,
  queryRateLimiter
};