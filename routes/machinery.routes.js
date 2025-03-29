const express = require("express");
const {
  getAllMachinery,
  getMachineryById,
  createMachinery,
  updateMachinery,
  deleteMachinery,
} = require("../controllers/machinery.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllMachinery);
router.get("/:id", getMachineryById);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  createMachinery
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  updateMachinery
);
router.delete("/:id", protect, restrictTo("admin"), deleteMachinery);

module.exports = router;
