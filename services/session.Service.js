const reusable = require("../utils/reusable.js");
const redisDal = require("../DAL/redis.Dal.js");
class sessionService {
    constructor() { };

    async createSession(userId, refreshToken) {
        const sessionId = reusable.generateRandomId();
        const hashedRefreshToken = reusable.generateHash(refreshToken);

        const session = {
            sessionId,
            userId,
            refreshTokenHash: hashedRefreshToken,
            revoked: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };

        const ttl = 7 * 24 * 60 * 60;

        await redisDal.set(`session:${sessionId}`, session, ttl);

        // add sessionId to user's session index
        await redisDal.sadd(`user:sessions:${userId}`, sessionId);

        return session;
    }


    async getUserSessions(userId) {

        const sessionIds = await redisDal.smembers(`user:sessions:${userId}`);

        if (!sessionIds || sessionIds.length === 0) {
            return [];
        }

        const keys = sessionIds.map(id => `session:${id}`);

        const sessions = await redisDal.mget(keys);

        return sessions.filter(Boolean); // remove expired sessions
    };

    async revokeSession(userId, sessionId) {
        await redisDal.del(`session:${sessionId}`);
        await redisDal.srem(`user:sessions:${userId}`, sessionId);
    }
};


module.exports = new sessionService();