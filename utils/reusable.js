const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const hashPassword = async (pwd, salt = 10) => {
    const sa = await bcrypt.genSalt(salt);
    return await bcrypt.hash(pwd, salt);
};

const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
};


const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
    return { accessToken, refreshToken };
};


const verifyToken = (token, type = "access") => {
    try {
        let decoded;
        if (type == "refresh") {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        }
        else {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        }
        return {
            success: true,
            decoded
        };
    } catch (error) {
        return { success: false, error };
    }
};

const generateRandomId = () => {
    return crypto.randomUUID();
};

const generateHash = (key) => {
    return crypto.createHash('sha256').update(key).digest('hex');
};

module.exports = {
    hashPassword,
    comparePassword,
    generateOtp,
    generateTokens,
    verifyToken,
    generateRandomId,
    generateHash
};