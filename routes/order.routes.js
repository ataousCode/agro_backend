const express = require("express");
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrders,
} = require("../controllers/order.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const { orderValidation } = require("../middlewares/validation.middleware");

const router = express.Router();

// Protected routes
router.post("/", protect, orderValidation, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllOrders);
router.put("/:id/status", protect, restrictTo("admin"), updateOrderStatus);
router.put("/:id/pay", protect, restrictTo("admin"), updatePaymentStatus);

module.exports = router;
