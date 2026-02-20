const express =require("express");
const { signup, login, logout, googleAuth, isUseNameExists, setUseName, sendOtp, resetPassword, otpVerification } = require("../controllers/authControllers");


const authRouter = express.Router();


authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.get("/logout",logout);
authRouter.post("/isUseNameExists",isUseNameExists);
authRouter.post("/googleAuth",googleAuth);
authRouter.post("/setUseName",setUseName);
// RESET PASSWORD
authRouter.post("/sendOtp",sendOtp);
authRouter.post("/otpVerification",otpVerification);
authRouter.post("/resetPassword",resetPassword);



module.exports = authRouter;