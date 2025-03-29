const Seed = require("../models/seed.model");
const { AppError } = require("../middlewares/error.middleware");

/**
 * Get all seeds with pagination
 * @route GET /api/seeds
 * @access Public
 */
const getAllSeeds = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { productType: "Seed" };

    // Apply filters
    if (req.query.seedType) {
      query.seedType = req.query.seedType;
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
    const total = await Seed.countDocuments(query);

    // Get seeds
    const seeds = await Seed.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        seeds,
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
 * Get seed by ID
 * @route GET /api/seeds/:id
 * @access Public
 */
const getSeedById = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.id);

    if (!seed) {
      return next(new AppError("Seed not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        seed,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create seed (admin only)
 * @route POST /api/seeds
 * @access Private/Admin
 */
const createSeed = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    // Create seed
    const seed = await Seed.create({
      ...req.body,
      category: "seed",
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: {
        seed,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update seed (admin only)
 * @route PUT /api/seeds/:id
 * @access Private/Admin
 */
const updateSeed = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.id);

    if (!seed) {
      return next(new AppError("Seed not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updatedSeed = await Seed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        seed: updatedSeed,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete seed (admin only)
 * @route DELETE /api/seeds/:id
 * @access Private/Admin
 */
const deleteSeed = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.id);

    if (!seed) {
      return next(new AppError("Seed not found", 404));
    }

    await Seed.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSeeds,
  getSeedById,
  createSeed,
  updateSeed,
  deleteSeed,
};
