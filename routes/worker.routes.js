const express = require("express");
const {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} = require("../controllers/worker.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  createWorker
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  updateWorker
);
router.delete("/:id", protect, restrictTo("admin"), deleteWorker);

module.exports = router;
