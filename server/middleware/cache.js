import { cache } from '../config/redis.js';

/**
 * Cache middleware for GET requests.
 * @param {string} prefix - Cache key prefix (e.g., 'products', 'team')
 * @param {number} ttl - Time to live in seconds (default: 5 minutes)
 */
const cacheMiddleware = (prefix, ttl = 300) => {
    return async (req, res, next) => {
        const key = `${prefix}:${req.originalUrl}`;

        try {
            const cached = await cache.get(key);
            if (cached) {
                console.log(`[Cache] HIT - ${key}`);
                return res.status(200).json(cached);
            }
            console.log(`[Cache] MISS - ${key}`);
        } catch {
            // Continue without cache on error
        }

        // Monkey-patch res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode === 200 && body?.success) {
                cache.set(key, body, ttl).catch(() => { });
            }
            return originalJson(body);
        };

        next();
    };
};

/**
 * Invalidate cache for a given prefix after write operations.
 * @param {string} prefix - Cache key prefix to invalidate
 */
const invalidateCache = (prefix) => {
    return async (req, res, next) => {
        // Monkey-patch res.json to invalidate after successful write
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (body?.success) {
                cache.invalidate(`${prefix}:*`).then(() => {
                    console.log(`[Cache] Invalidated - ${prefix}:*`);
                }).catch(() => { });
            }
            return originalJson(body);
        };

        next();
    };
};

export { cacheMiddleware, invalidateCache };
