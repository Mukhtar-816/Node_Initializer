const {Router :router } = require("express");
const authController = require("../controllers/auth.Controller.js");

const Router = router();

Router.route("/login").post(authController.login);
Router.route("/register").post(authController.register);
Router.route("/register/verify").post(authController.registerVerify);
Router.route("/refresh-access-token").post(authController.refreshAccessToken);
Router.route("/logout").post(authController.logout);


module.exports = Router;