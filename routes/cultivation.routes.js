const express = require("express");
const {
  getAllCropTypes,
  getAllCultivationProcesses,
  getCultivationProcessById,
  createCultivationProcess,
  updateCultivationProcess,
  deleteCultivationProcess,
} = require("../controllers/cultivation.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
router.get("/crops", getAllCropTypes);
router.get("/", getAllCultivationProcesses);
router.get("/:id", getCultivationProcessById);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  createCultivationProcess
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  updateCultivationProcess
);
router.delete("/:id", protect, restrictTo("admin"), deleteCultivationProcess);

module.exports = router;
