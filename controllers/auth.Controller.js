const authService = require("../services/auth.Service.js");
const CustomError = require("../utils/CustomError.js");
const zodValidator = require("../validators/zodValidator.js");

// Helper for consistent cookie settings
const setTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD", // ensures boolean check
        sameSite: process.env.NODE_ENV === "PROD" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });
};

const login = async (req, res, next) => {
    try {
        const validatedData = zodValidator.loginSchemaValidator.safeParse(req.body);

        // 400 is standard for validation/syntax errors
        if (!validatedData.success) {
            throw new CustomError({ message: "Invalid Data", status: 400, error: validatedData.error });
        }

        const { email, password } = validatedData.data;
        const response = await authService.login(email, password);

        setTokenCookie(res, response.refreshToken);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            accessToken: response.accessToken
        });
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const validatedData = zodValidator.registerSchemaValidator.safeParse(req.body);

        if (!validatedData.success) {
            throw new CustomError({ message: "Invalid Data", status: 400, error: validatedData.error });
        }

        const { username, email, password } = validatedData.data;
        const response = await authService.register(username, email, password);

        return res.status(200).json({
            success: true,
            message: response.message || "OTP has been sent to your email."
        });
    } catch (error) {
        next(error);
    }
};

const registerVerify = async (req, res, next) => {
    try {
        const { verificationCode, email } = req.body;

        // 400 is more appropriate here than 404
        if (!verificationCode || !email) {
            throw new CustomError({ message: "Missing required fields", status: 400 });
        }

        const response = await authService.registerVerify(verificationCode, email);

        setTokenCookie(res, response.refreshToken);

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            accessToken: response.accessToken,
            user: response.user
        });
    } catch (error) {
        next(error);
    }
};

const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw new CustomError({ message: "Session not found", status: 401 });

        const response = await authService.refreshAccessToken(refreshToken);
        
        // Replace old cookie with the new rotated one
        setTokenCookie(res, response.refreshToken);

        res.status(200).json({
            success: true,
            accessToken: response.accessToken
        });
    } catch (error) {
        // If refresh fails (stolen token/expired), clear the cookie to force re-login
        res.clearCookie("refreshToken");
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        
        // Even if no token, we clear the cookie to be safe
        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.clearCookie("refreshToken", { path: "/" })
           .status(200)
           .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.clearCookie("refreshToken");
        next(error);
    }
}

module.exports = {
    register,
    registerVerify,
    login,
    logout,
    refreshAccessToken
};