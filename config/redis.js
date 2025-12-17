// const redis = require('redis');
// require('dotenv').config();
// const redisClient = redis.createClient({
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT
//     }
// });

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// redisClient.connect();

// module.exports = redisClient;
const redis = require('redis');
require('dotenv').config();

let redisClient = null;

const initRedis = async () => {
    try {
        const client = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                reconnectStrategy: false 
            }
        });

        client.on('error', (err) => {
            console.error('⚠️ Redis error:', err.message);
        });

        await client.connect();

        console.log('Redis connected');
        redisClient = client;

    } catch (err) {
        console.error(' Redis connection failed, continuing without Redis');
        redisClient = null;
    }
};

module.exports = {
    redisClient,
    initRedis
};
