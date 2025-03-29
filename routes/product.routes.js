const express = require("express");
const {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
} = require("../controllers/product.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/:id/reviews", protect, addProductReview);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  updateProduct
);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

module.exports = router;
