const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController"); 

authRouter.post("/signup", authController.postSignupRequest)
authRouter.post("/login", authController.postLoginRequest)


module.exports = authRouter;