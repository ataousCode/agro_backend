const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.util");
const { createOTPData, isOTPExpired } = require("../utils/otp.util");
const { sendOtpEmail, sendPasswordResetEmail } = require("../utils/email.util");
const { AppError } = require("../middlewares/error.middleware");

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists if yes return error
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with that email or phone",
      });
    }

    // Generate OTP
    const otpData = createOTPData();

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      otp: otpData,
    });

    // Send OTP email
    await sendOtpEmail(email, name, otpData.code);

    res.status(201).json({
      success: true,
      message:
        "User registered. Please verify your account with the OTP sent to your email",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP is correct and not expired
    if (!user.otp || user.otp.code !== otp || isOTPExpired(user.otp.expiry)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Mark user as verified and remove OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate token
    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP
      const otpData = createOTPData();
      user.otp = otpData;
      await user.save();

      // Send OTP email
      await sendOtpEmail(user.email, user.name, otpData.code);

      return res.status(400).json({
        success: false,
        message: "Account not verified. A new OTP has been sent to your email",
        data: {
          userId: user._id,
          verified: false,
        },
      });
    }

    // Generate token
    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = createOTPData();
    user.otp = otpData;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.name, otpData.code);

    res.status(200).json({
      success: true,
      message: "Password reset OTP has been sent to your email",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { userId, otp, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP is correct and not expired
    if (!user.otp || user.otp.code !== otp || isOTPExpired(user.otp.expiry)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update password and remove OTP
    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          postCode: user.postCode,
          profileImage: user.profileImage,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
  getMe,
};
