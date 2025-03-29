const Machinery = require("../models/machinery.model");
const { AppError } = require("../middlewares/error.middleware");

/**
 * Get all machinery with pagination
 * @route GET /api/machinery
 * @access Public
 */
const getAllMachinery = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { productType: "Machinery" };

    // Apply filters
    if (req.query.machineryType) {
      query.machineryType = req.query.machineryType;
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
    const total = await Machinery.countDocuments(query);

    // Get machinery
    const machinery = await Machinery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        machinery,
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
 * Get machinery by ID
 * @route GET /api/machinery/:id
 * @access Public
 */
const getMachineryById = async (req, res, next) => {
  try {
    const machinery = await Machinery.findById(req.params.id);

    if (!machinery) {
      return next(new AppError("Machinery not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        machinery,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create machinery (admin only)
 * @route POST /api/machinery
 * @access Private/Admin
 */
const createMachinery = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    // Create machinery
    const machinery = await Machinery.create({
      ...req.body,
      category: "machinery",
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: {
        machinery,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update machinery (admin only)
 * @route PUT /api/machinery/:id
 * @access Private/Admin
 */
const updateMachinery = async (req, res, next) => {
  try {
    const machinery = await Machinery.findById(req.params.id);

    if (!machinery) {
      return next(new AppError("Machinery not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updatedMachinery = await Machinery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        machinery: updatedMachinery,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete machinery (admin only)
 * @route DELETE /api/machinery/:id
 * @access Private/Admin
 */
const deleteMachinery = async (req, res, next) => {
  try {
    const machinery = await Machinery.findById(req.params.id);

    if (!machinery) {
      return next(new AppError("Machinery not found", 404));
    }

    await Machinery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMachinery,
  getMachineryById,
  createMachinery,
  updateMachinery,
  deleteMachinery,
};
