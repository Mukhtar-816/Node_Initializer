const redisClient = require("../config/redis.js");
const CustomError = require("../utils/CustomError.js");

const RateLimiter = (limit = 60, windowInSeconds = 60) => {
    return async (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const key = `rl:${req.method}:${req.originalUrl}:${ip}`;

        try {
            const multi = redisClient.multi();
            multi.incr(key);
            multi.ttl(key);
            
            const results = await multi.exec();
            
            // Handle different Redis client response formats ([err, val] vs [val])
            const count = Array.isArray(results[0]) ? results[0][1] : results[0];
            const ttl = Array.isArray(results[1]) ? results[1][1] : results[1];

            if (ttl === -1) {
                await redisClient.expire(key, windowInSeconds);
            }

            if (count > limit) {
                // IMPORTANT: You must return and call next(error)
                return next(new CustomError({
                    message: `Too many requests. Try again in ${ttl > 0 ? ttl : windowInSeconds} seconds.`,
                    status: 429
                }));
            }

            next();
        } catch (error) {
            // If Redis fails, we usually let the user through so the app doesn't break
            next(); 
        }
    };
};

module.exports = RateLimiter;

// const redisClient = require("../config/redis.config.js");
// const CustomError = require("../utils/CustomError.js");

// const rateLimiter = (limit, windowInSeconds) => {
//     return async (req, res, next) => {
//         const ip = req.ip || req.headers['x-forwarded-for'];
//         const key = `rate-limit:${req.originalUrl}:${ip}`;

//         // The Lua Script:
//         // ARGV[1] = limit, ARGV[2] = window
//         const luaScript = `
//             local current = redis.call("INCR", KEYS[1])
//             if current == 1 then
//                 redis.call("EXPIRE", KEYS[1], ARGV[2])
//             end
//             return current
//         `;

//         try {
//             // EVAL runs the script atomically inside Redis
//             const count = await redisClient.eval(luaScript, 1, key, limit, windowInSeconds);

//             if (count > limit) {
//                 throw new CustomError({
//                     message: "Too many requests. Please try again later.",
//                     status: 429
//                 });
//             }

//             next();
//         } catch (error) {
//             next(error);
//         }
//     };
// };