const express = require("express");
const {
  getAllSeedlings,
  getSeedlingById,
  createSeedling,
  updateSeedling,
  deleteSeedling,
} = require("../controllers/seedling.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllSeedlings);
router.get("/:id", getSeedlingById);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  createSeedling
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  updateSeedling
);
router.delete("/:id", protect, restrictTo("admin"), deleteSeedling);

module.exports = router;
