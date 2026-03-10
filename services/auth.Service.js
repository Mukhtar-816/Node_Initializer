const userDal = require("../DAL/user.Dal.js");
const redisDal = require("../DAL/redis.Dal.js");
const CustomError = require("../utils/CustomError");
const reusable = require("../utils/reusable.js");
const sessionService = require("./session.Service.js");

class AuthService {
    constructor() { }

    async login(email, password) {
        const userExist = await userDal.findUserByKey({ email });

        // generic message to prevent account enumeration
        if (!userExist) {
            throw new CustomError({ message: "Invalid email or password", status: 401 });
        }

        const isMatch = await reusable.comparePassword(password, userExist.passwordHash);
        if (!isMatch) {
            throw new CustomError({ message: "Invalid email or password", status: 401 });
        }

        let userSessions = await sessionService.getUserSessions(userExist._id);

        // enforce max 3 concurrent sessions (FIFO)
        while (userSessions && userSessions.length >= 3) {
            const oldestSession = userSessions.shift();
            if (oldestSession?.sessionId) {
                await sessionService.revokeSession(userExist._id, oldestSession.sessionId);
            }
        }

        const { accessToken, refreshToken } = reusable.generateTokens({ _id: userExist._id });

        await sessionService.createSession(userExist._id, refreshToken);

        return {
            success: true,
            accessToken,
            refreshToken,
        };
    }

    async register(username, email, password) {
        // parallel check for performance
        const [userExistByUsername, userExistByEmail] = await Promise.all([
            userDal.findUserByKey({ username }),
            userDal.findUserByKey({ email })
        ]);

        if (userExistByEmail) {
            throw new CustomError({ message: "Email already registered", status: 409 });
        }
        if (userExistByUsername) {
            throw new CustomError({ message: "Username already taken", status: 409 });
        }

        const passwordHash = await reusable.hashPassword(password);
        const otp = reusable.generateOtp();

        const tempUser = {
            username,
            email,
            passwordHash,
            isVerified: false,
        };

        // stage user and otp in redis before db persistence
        await redisDal.set(`temp:user:${email}`, tempUser);
        await redisDal.set(`otp:${email}`, otp);

        return {
            success: true,
            message: `Otp sent successfully to ${email}`
        };
    }

    async registerVerify(otp, email) {
        const [userExist, savedOtp] = await Promise.all([
            redisDal.get(`temp:user:${email}`),
            redisDal.get(`otp:${email}`)
        ]);

        if (!userExist) {
            throw new CustomError({ message: "Registration session expired", status: 404 });
        }

        if (!savedOtp) {
            throw new CustomError({ message: "OTP has expired", status: 400 });
        }

        // type-safe string comparison
        if (String(savedOtp) !== String(otp)) {
            throw new CustomError({ message: "Invalid OTP", status: 400 });
        }

        const user = await userDal.createUser(userExist);

        const { accessToken, refreshToken } = reusable.generateTokens({ _id: user._id });
        await sessionService.createSession(user._id, refreshToken);

        // cleanup cache
        await Promise.all([
            redisDal.del(`temp:user:${email}`),
            redisDal.del(`otp:${email}`)
        ]);

        return {
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        };
    };

    async refreshAccessToken(refreshToken) {
        const { success, decoded } = reusable.verifyToken(refreshToken, "refresh");
        if (!success || !decoded?._id) {
            throw new CustomError({ message: "Invalid or Expired Token", status: 401 });
        }

        let userSessions = await sessionService.getUserSessions(decoded._id);
        const refreshTokenHash = reusable.generateHash(refreshToken);
        const currentSession = userSessions.find(s => s.refreshTokenHash === refreshTokenHash);

        // Security: Detection of reused/stolen tokens
        if (!currentSession || currentSession.revoked) {
            // if (currentSession?.revoked) await sessionService.revokeAllSessions(decoded._id);
            throw new CustomError({ message: "Security Alert: Token reuse", status: 403 });
        }

        if (new Date(currentSession.expiresAt).getTime() < Date.now()) {
            throw new CustomError({ message: "Session expired", status: 401 });
        }

        // Remove the old session before issuing the new one
        await sessionService.revokeSession(decoded._id, currentSession.sessionId);

        // Re-fetch/filter to ensure we stay under the 3-session cap
        userSessions = userSessions.filter(s => s.sessionId !== currentSession.sessionId);
        while (userSessions.length >= 3) {
            const oldest = userSessions.shift();
            await sessionService.revokeSession(decoded._id, oldest.sessionId);
        }

        const { accessToken, refreshToken: newRefreshToken } = reusable.generateTokens({ _id: decoded._id });
        await sessionService.createSession(decoded._id, newRefreshToken);

        return {
            success: true,
            accessToken,
            refreshToken: newRefreshToken
        };
    };

    async logout(refreshToken) {
        let { success, decoded } = reusable.verifyToken(refreshToken, "refresh");

        if (!success || !decoded) throw new CustomError({ message: "Invalid Token", status: 404 });

        // const user =  dont check for user, it isnt worth

        let userSessions = await sessionService.getUserSessions(decoded._id);
        const refreshTokenHash = reusable.generateHash(refreshToken);
        const currentSession = userSessions.find(s => s.refreshTokenHash === refreshTokenHash);

        // Security: Detection of reused/stolen tokens
        if (!currentSession || currentSession.revoked) {
            // if (currentSession?.revoked) await sessionService.revokeAllSessions(decoded._id);
            throw new CustomError({ message: "Security Alert: Token reuse", status: 403 });
        };

        await sessionService.revokeSession(decoded._id, currentSession.sessionId);

        return {
            success : true,
            message : "log out Successful"
        }
    }
};

module.exports = new AuthService();