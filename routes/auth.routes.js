const express = require("express");
const {
  register,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const {
  registerValidation,
  loginValidation,
  verifyOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middlewares/validation.middleware");

const router = express.Router();

router.post("/register", register);//registerValidation
router.post("/verify-otp", verifyOTP); //verifyOtpValidation
router.post("/login", login);//loginValidation
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.get("/me", protect, getMe);

module.exports = router;
