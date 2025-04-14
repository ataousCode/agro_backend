const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  updatePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const {
  updateProfileValidation,
  updatePasswordValidation,
} = require("../middlewares/validation.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);//updateProfileValidation
router.put(
  "/profile/image",
  protect,
  upload.single("image"),
  uploadProfileImage
);
router.put("/password", protect, updatePassword); //updatePasswordValidation

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get("/:id", protect, restrictTo("admin"), getUserById);
router.put("/:id", protect, restrictTo("admin"), updateUser);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

module.exports = router;
