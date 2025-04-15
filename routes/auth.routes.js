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

router.post("/register", registerValidation, register);
router.post("/verify-otp", verifyOtpValidation, verifyOTP);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.get("/me", protect, getMe);

module.exports = router;
