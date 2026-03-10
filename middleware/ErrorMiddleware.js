const CustomError = require("../utils/CustomError");

const errorMiddleware = (err, req, res, next) => {
    // Ensure error is always a CustomError
    const error = err instanceof CustomError ? err : new CustomError({ error: err });

    return res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.error || null,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorMiddleware;