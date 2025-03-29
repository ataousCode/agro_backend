const Product = require("../models/product.model");
const { AppError } = require("../middlewares/error.middleware");
const upload = require("../middlewares/upload.middleware");

/**
 * Get all products with pagination
 * @route GET /api/products
 * @access Public
 */
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Apply filters
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice),
      };
    } else if (req.query.minPrice) {
      query.price = { $gte: parseFloat(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      query.price = { $lte: parseFloat(req.query.maxPrice) };
    }

    // Get total count
    const total = await Product.countDocuments(query);

    // Get products
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 * @route GET /api/products/featured
 * @access Public
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 * @access Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products
 * @route GET /api/products/search
 * @access Public
 */
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(new AppError("Search query is required", 400));
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create product (admin only)
 * @route POST /api/products
 * @access Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    // Create product
    const product = await Product.create({
      ...req.body,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (admin only)
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (admin only)
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product review
 * @route POST /api/products/:id/reviews
 * @access Private
 */
const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Check if user already reviewed
    if (
      product.reviews &&
      product.reviews.some((r) => r.user.toString() === req.user.id)
    ) {
      return next(new AppError("You have already reviewed this product", 400));
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Add review
    if (!product.reviews) {
      product.reviews = [];
    }
    product.reviews.push(review);

    // Update ratings
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
};
