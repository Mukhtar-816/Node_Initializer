const redis = require("../config/redis.js");

class RedisDal {
    constructor() {}

    async set(key, value, ttl = 10 * 60) {
        if (!key) throw new Error("Redis key is required");

        const data =
            typeof value === "string" ? value : JSON.stringify(value);

        return await redis.set(key, data, "EX", ttl);
    }

    async get(key) {
        if (!key) return null;

        const data = await redis.get(key);
        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }

    async mget(keys = []) {
        if (!keys.length) return [];

        const values = await redis.mget(keys);

        return values.map(v => {
            if (!v) return null;
            try {
                return JSON.parse(v);
            } catch {
                return v;
            }
        });
    }

    async getDel(key) {
        if (!key) return null;

        const data = await redis.getdel(key);
        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }

    async del(key) {
        if (!key) return 0;
        return await redis.del(key);
    }

    async exists(key) {
        return await redis.exists(key);
    }

    /* ---------- SET OPERATIONS ---------- */

    async sadd(key, value) {
        if (!key) throw new Error("Redis key is required");
        return await redis.sadd(key, value);
    }

    async smembers(key) {
        if (!key) return [];
        return await redis.smembers(key);
    }

    async srem(key, value) {
        if (!key) return 0;
        return await redis.srem(key, value);
    }

    async expire(key, ttl) {
        if (!key) return 0;
        return await redis.expire(key, ttl);
    }
}

module.exports = new RedisDal();