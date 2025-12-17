const redisClient = require('../config/redis');

/**
 * Rate limiting middleware using Redis.
 * Limits the number of requests from an IP address within a specified time window.
 */
const rateLimiter = (keyPrefix, limit = 10, windowSeconds = 60) => {
    return async (req, res, next) => {
        const key = `${keyPrefix}:${req.ip}`;
        try {
            const current = await redisClient.incr(key);

            if (current === 1) {
                await redisClient.expire(key, windowSeconds);
            }

            if (current > limit) {
                return res.status(429).json({ message: 'Too many requests. Please try again later.' });
            }

            next();
        } catch (err) {
            console.error(err);
            next();
        }
    };
};

module.exports = rateLimiter;
