const Cultivation = require("../models/cultivation.model");
const { AppError } = require("../middlewares/error.middleware");

/**
 * Get all crop types
 * @route GET /api/cultivation/crops
 * @access Public
 */
const getAllCropTypes = async (req, res, next) => {
  try {
    const crops = await Cultivation.distinct("cropType");

    res.status(200).json({
      success: true,
      data: {
        crops,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all cultivation processes with pagination
 * @route GET /api/cultivation
 * @access Public
 */
const getAllCultivationProcesses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Apply filters
    if (req.query.cropType) {
      query.cropType = req.query.cropType;
    }

    // Get total count
    const total = await Cultivation.countDocuments(query);

    // Get cultivation processes
    const cultivationProcesses = await Cultivation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        cultivationProcesses,
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
 * Get cultivation process by ID
 * @route GET /api/cultivation/:id
 * @access Public
 */
const getCultivationProcessById = async (req, res, next) => {
  try {
    const cultivationProcess = await Cultivation.findById(
      req.params.id
    ).populate("relatedProducts");

    if (!cultivationProcess) {
      return next(new AppError("Cultivation process not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        cultivationProcess,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create cultivation process (admin only)
 * @route POST /api/cultivation
 * @access Private/Admin
 */
const createCultivationProcess = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    const { title, cropType, description, steps, relatedProducts } = req.body;

    // Parse steps and related products if they are strings
    const parsedSteps = typeof steps === "string" ? JSON.parse(steps) : steps;
    const parsedRelatedProducts =
      typeof relatedProducts === "string"
        ? JSON.parse(relatedProducts)
        : relatedProducts;

    // Create cultivation process
    const cultivationProcess = await Cultivation.create({
      title,
      cropType,
      description,
      image: req.file.filename,
      steps: parsedSteps,
      relatedProducts: parsedRelatedProducts,
    });

    res.status(201).json({
      success: true,
      data: {
        cultivationProcess,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cultivation process (admin only)
 * @route PUT /api/cultivation/:id
 * @access Private/Admin
 */
const updateCultivationProcess = async (req, res, next) => {
  try {
    const cultivationProcess = await Cultivation.findById(req.params.id);

    if (!cultivationProcess) {
      return next(new AppError("Cultivation process not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    // Parse steps and related products if they are strings
    if (req.body.steps && typeof req.body.steps === "string") {
      req.body.steps = JSON.parse(req.body.steps);
    }

    if (
      req.body.relatedProducts &&
      typeof req.body.relatedProducts === "string"
    ) {
      req.body.relatedProducts = JSON.parse(req.body.relatedProducts);
    }

    const updatedCultivationProcess = await Cultivation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        cultivationProcess: updatedCultivationProcess,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete cultivation process (admin only)
 * @route DELETE /api/cultivation/:id
 * @access Private/Admin
 */
const deleteCultivationProcess = async (req, res, next) => {
  try {
    const cultivationProcess = await Cultivation.findById(req.params.id);

    if (!cultivationProcess) {
      return next(new AppError("Cultivation process not found", 404));
    }

    await Cultivation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCropTypes,
  getAllCultivationProcesses,
  getCultivationProcessById,
  createCultivationProcess,
  updateCultivationProcess,
  deleteCultivationProcess,
};
