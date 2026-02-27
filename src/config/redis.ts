import IORedis from "ioredis";

export const redisConnection = new IORedis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || "6379"), 
    family: 4,   
    maxRetriesPerRequest: null,
})