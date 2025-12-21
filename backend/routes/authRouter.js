const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController"); 

authRouter.post("/signup", authController.postSignupRequest)
authRouter.post("/login", authController.postLoginRequest)
authRouter.post("/logout", authController.postLogoutRequest)

// Return current session auth status
authRouter.get("/status", authController.getStatus)


module.exports = authRouter;