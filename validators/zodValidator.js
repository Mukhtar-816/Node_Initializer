const {z} = require("zod");

const loginSchemaValidator = z.object({
    // username: z.string().min(2, "username must be 3 chars long."),
    email : z.string().email("Invalid email format."),
    password : z.string().min(8,"Password must be 8 chars long")
});

const registerSchemaValidator = z.object({
    username: z.string().min(2, "username must be 3 chars long."),
    email : z.string().email("Invalid email format."),
    password : z.string().min(8,"Password must be 8 chars long")
});


module.exports = {
    loginSchemaValidator,
    registerSchemaValidator
};
