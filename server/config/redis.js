import Redis from 'ioredis';

let redisClient = null;
let inMemoryCache = new Map();
let useRedis = false;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

try {
    redisClient = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
            if (times > 2) {
                console.log('[Redis] Max retries reached, falling back to in-memory cache');
                useRedis = false;
                return null; // Stop retrying
            }
            return Math.min(times * 200, 1000);
        },
        lazyConnect: true
    });

    redisClient.on('connect', () => {
        console.log('[Redis] Connected successfully');
        useRedis = true;
    });

    redisClient.on('error', (err) => {
        if (useRedis) {
            console.warn('[Redis] Connection error, falling back to in-memory cache');
            useRedis = false;
        }
    });

    // Try to connect
    redisClient.connect().catch(() => {
        console.log('[Redis] Not available, using in-memory cache');
        useRedis = false;
    });

} catch (err) {
    console.log('[Redis] Init failed, using in-memory cache');
    useRedis = false;
}

// Unified cache interface
const cache = {
    async get(key) {
        try {
            if (useRedis && redisClient) {
                const data = await redisClient.get(key);
                return data ? JSON.parse(data) : null;
            }
            const entry = inMemoryCache.get(key);
            if (!entry) return null;
            if (Date.now() > entry.expiry) {
                inMemoryCache.delete(key);
                return null;
            }
            return entry.data;
        } catch {
            return null;
        }
    },

    async set(key, value, ttlSeconds = 300) {
        try {
            if (useRedis && redisClient) {
                await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
            } else {
                inMemoryCache.set(key, {
                    data: value,
                    expiry: Date.now() + ttlSeconds * 1000
                });
            }
        } catch {
            // Silently fail
        }
    },

    async invalidate(pattern) {
        try {
            if (useRedis && redisClient) {
                const keys = await redisClient.keys(pattern);
                if (keys.length > 0) await redisClient.del(...keys);
            } else {
                for (const key of inMemoryCache.keys()) {
                    if (key.includes(pattern.replace('*', ''))) {
                        inMemoryCache.delete(key);
                    }
                }
            }
        } catch {
            // Silently fail
        }
    },

    async flush() {
        try {
            if (useRedis && redisClient) {
                await redisClient.flushdb();
            } else {
                inMemoryCache.clear();
            }
        } catch {
            inMemoryCache.clear();
        }
    }
};

export { cache, redisClient, useRedis };
