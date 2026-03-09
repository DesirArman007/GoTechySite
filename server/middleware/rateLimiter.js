import rateLimit from 'express-rate-limit';

/**
 * General rate limiter for all API routes.
 * 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

/**
 * Stricter rate limiter for admin/write operations.
 * 30 requests per 15 minutes per IP.
 */
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many admin requests, please try again later.'
    }
});

export { generalLimiter, adminLimiter };
