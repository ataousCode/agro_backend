const Disease = require("../models/disease.model");
const { AppError } = require("../middlewares/error.middleware");

/**
 * Get all diseases with pagination
 * @route GET /api/diseases
 * @access Public
 */
const getAllDiseases = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Apply filters
    if (req.query.cropType) {
      query.cropType = req.query.cropType;
    }

    if (req.query.contentType) {
      query.contentType = req.query.contentType;
    }

    // Get total count
    const total = await Disease.countDocuments(query);

    // Get diseases
    const diseases = await Disease.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        diseases,
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
 * Get disease by ID
 * @route GET /api/diseases/:id
 * @access Public
 */
const getDiseaseById = async (req, res, next) => {
  try {
    const disease = await Disease.findById(req.params.id).populate(
      "relatedProducts"
    );

    if (!disease) {
      return next(new AppError("Disease not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        disease,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create disease (admin only)
 * @route POST /api/diseases
 * @access Private/Admin
 */
const createDisease = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    const {
      title,
      cropType,
      symptoms,
      causes,
      prevention,
      solution,
      videoLink,
      contentType,
      relatedProducts,
    } = req.body;

    // Parse related products if it's a string
    const parsedRelatedProducts =
      typeof relatedProducts === "string"
        ? JSON.parse(relatedProducts)
        : relatedProducts;

    // Create disease
    const disease = await Disease.create({
      title,
      cropType,
      symptoms,
      causes,
      prevention,
      solution,
      image: req.file.filename,
      videoLink,
      contentType: contentType || "blog",
      relatedProducts: parsedRelatedProducts,
    });

    res.status(201).json({
      success: true,
      data: {
        disease,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update disease (admin only)
 * @route PUT /api/diseases/:id
 * @access Private/Admin
 */
const updateDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findById(req.params.id);

    if (!disease) {
      return next(new AppError("Disease not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    // Parse related products if it's a string
    if (
      req.body.relatedProducts &&
      typeof req.body.relatedProducts === "string"
    ) {
      req.body.relatedProducts = JSON.parse(req.body.relatedProducts);
    }

    const updatedDisease = await Disease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        disease: updatedDisease,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete disease (admin only)
 * @route DELETE /api/diseases/:id
 * @access Private/Admin
 */
const deleteDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findById(req.params.id);

    if (!disease) {
      return next(new AppError("Disease not found", 404));
    }

    await Disease.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
};
