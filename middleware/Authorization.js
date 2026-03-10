const CustomError = require("../utils/CustomError.js");
const reusable = require("../utils/reusable.js");

const Authorization = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new CustomError({ message: "No token provided", status: 401 });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new CustomError({ message: "Authentication format invalid", status: 401 });
        }

        const token = parts[1];
        const { success, decoded, error } = reusable.verifyToken(token); 

        if (!success) {
            if (error?.name == "TokenExpiredError" || error === "TokenExpiredError") {
                throw new CustomError({ message: "Access token expired", status: 401 });
            }
            throw new CustomError({ message: "Unauthorized access", status: 401 });
        }

        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = Authorization;