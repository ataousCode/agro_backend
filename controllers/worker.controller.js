const Worker = require("../models/worker.model");
const { AppError } = require("../middlewares/error.middleware");

/**
 * I get all workers with pagination => public routes for all users
 * @route GET /api/workers
 * @access Public
 */
const getAllWorkers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { productType: "Worker" };

    // Apply filters
    if (req.query.specialization) {
      query.specialization = req.query.specialization;
    }

    if (req.query.minPrice && req.query.maxPrice) {
      query.wage = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice),
      };
    } else if (req.query.minPrice) {
      query.wage = { $gte: parseFloat(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      query.wage = { $lte: parseFloat(req.query.maxPrice) };
    }

    // Get total count
    const total = await Worker.countDocuments(query);

    // Get workers
    const workers = await Worker.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        workers,
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
 * Get worker by ID
 * @route GET /api/workers/:id
 * @access Public
 */
const getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return next(new AppError("Worker not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        worker,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create worker (admin only)
 * @route POST /api/workers
 * @access Private/Admin
 */
const createWorker = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError("Please upload an image", 400));
    }

    // Create worker
    const worker = await Worker.create({
      ...req.body,
      category: "worker",
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: {
        worker,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update worker (admin only)
 * @route PUT /api/workers/:id
 * @access Private/Admin
 */
const updateWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return next(new AppError("Worker not found", 404));
    }

    // Update image if provided
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        worker: updatedWorker,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete worker (admin only)
 * @route DELETE /api/workers/:id
 * @access Private/Admin
 */
const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return next(new AppError("Worker not found", 404));
    }

    await Worker.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
};
