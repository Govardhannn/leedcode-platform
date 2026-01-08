import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-16118.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16118
    }
});
