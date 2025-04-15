const { validationResult, body } = require("express-validator");
const { AppError } = require("./error.middleware");

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new AppError(errorMessages[0], 400));
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

const loginValidation = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone number is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const verifyOtpValidation = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  validate,
];

const forgotPasswordValidation = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone number is required"),
  validate,
];

const resetPasswordValidation = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

// Product validation rules
const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("category").notEmpty().withMessage("Product category is required"),
  validate,
];

// Order validation rules
const orderValidation = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one item"),
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  body("totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .isNumeric()
    .withMessage("Total price must be a number"),
  validate,
];

// Update profile validation rules
const updateProfileValidation = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  validate,
];

// Update password validation rules
const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  verifyOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  productValidation,
  orderValidation,
  updateProfileValidation,
  updatePasswordValidation,
};
