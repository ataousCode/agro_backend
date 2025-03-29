const express = require("express");
const {
  getAllSeeds,
  getSeedById,
  createSeed,
  updateSeed,
  deleteSeed,
} = require("../controllers/seed.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllSeeds);
router.get("/:id", getSeedById);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  createSeed
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  updateSeed
);
router.delete("/:id", protect, restrictTo("admin"), deleteSeed);

module.exports = router;
