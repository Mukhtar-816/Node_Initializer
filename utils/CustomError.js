const { ZodError } = require("zod");

class CustomError extends Error {
    constructor({ message, status, error } = {}) {
        // If a ZodError is passed, format it automatically
        if (error instanceof ZodError) {
            const formattedErrors = error.issues.map(e => ({
                field: e.path.join("."),
                message: e.message
            }));

            super(message || "Validation Error");
            this.status = status || 400;
            this.error = formattedErrors;
        } else {
            super(message || "Internal Server Error");
            this.status = status || 500;
            this.error = Array.isArray(error) ? error : [];
        }

        this.name = "CustomError";
        // Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;