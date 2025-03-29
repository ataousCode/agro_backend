const Seedling = require("../models/seedling.model");
const { AppError } = require("../middlewares/error.middleware");

/**
 * Get all seedlings with pagination
 * @route GET /api/seedlings
 * @access Public
 */
const getAllSeedlings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { productType: "Seedling" };

    // Apply filters
    if (req.query.seedlingType) {
      query.seedlingType = req.query.seedlingType;
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
    const total = await Seedling.countDocuments(query);

    // Get seedlings
    const seedlings = await Seedling.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        seedlings,
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
 * Get seedling by ID
 * @route GET /api/seedlings/:id
 * @access Public
 */
const getSeedlingById = async (req, res, next) => {
  try {
    const seedling = await Seedling.findById(req.params.id);

    if (!seedling) {
      return next(new AppError("Seedling not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        seedling,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create seedling (admin only)
 * @route POST /api/seedlings
 * @access Private/Admin
 */
const createSeedling = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    // Create seedling
    const seedling = await Seedling.create({
      ...req.body,
      category: "seedling",
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: {
        seedling,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update seedling (admin only)
 * @route PUT /api/seedlings/:id
 * @access Private/Admin
 */
const updateSeedling = async (req, res, next) => {
  try {
    const seedling = await Seedling.findById(req.params.id);

    if (!seedling) {
      return next(new AppError("Seedling not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updatedSeedling = await Seedling.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        seedling: updatedSeedling,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete seedling (admin only)
 * @route DELETE /api/seedlings/:id
 * @access Private/Admin
 */
const deleteSeedling = async (req, res, next) => {
  try {
    const seedling = await Seedling.findById(req.params.id);

    if (!seedling) {
      return next(new AppError("Seedling not found", 404));
    }

    await Seedling.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSeedlings,
  getSeedlingById,
  createSeedling,
  updateSeedling,
  deleteSeedling,
};
