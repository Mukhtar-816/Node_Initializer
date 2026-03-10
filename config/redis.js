const Redis = require("ioredis");


//redis instance
const redis = new Redis(process.env.REDIS_URL);


//connect to redis
redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("ready", () => {
    console.log("Redis Cache Ready.");
});

redis.on("error", (err) => {
    console.log("Error Connecting Redis : ", err);
});

module.exports = redis;