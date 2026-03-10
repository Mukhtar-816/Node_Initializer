const { Router: router } = require("express");
const authController = require("../controllers/auth.Controller.js");
const Authorization = require("../middleware/Authorization.js");
const RateLimiter = require("../middleware/RateLimiter.js");

const Router = router();

Router.route("/login").post(RateLimiter(3, 300), authController.login);
Router.route("/register").post(RateLimiter(3, 300), authController.register);
Router.route("/register/verify").post(RateLimiter(3, 300), authController.registerVerify);
Router.route("/refresh-access-token").post(authController.refreshAccessToken);
Router.route("/logout").post(RateLimiter(3, 300), Authorization, authController.logout);


module.exports = Router;