const Order = require("../models/order.model");
const { AppError } = require("../middlewares/error.middleware");
const { sendOrderConfirmationEmail } = require("../utils/email.util");

/**
 * Create order
 * @route POST /api/orders
 * @access Private
 */
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      deliveryCharge,
      discount,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new AppError("No order items", 400));
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      deliveryCharge: deliveryCharge || 0,
      discount: discount || 0,
      // Set estimated delivery date to 3 days from now
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    // Send order confirmation email
    await sendOrderConfirmationEmail(req.user.email, req.user.name, order);

    res.status(201).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Check if the user is the owner of the order or an admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Not authorized to access this order", 401));
    }

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my orders
 * @route GET /api/orders/my-orders
 * @access Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Order.countDocuments({ user: req.user.id });

    // Get orders
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
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
 * Update order status (admin only)
 * @route PUT /api/orders/:id/status
 * @access Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Update status
    order.status = status;

    // If status is 'Delivery', set isDelivered to true
    if (status === "Delivery") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update payment status (admin only)
 * @route PUT /api/orders/:id/pay
 * @access Private/Admin
 */
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Update payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult;

    await order.save();

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (admin only)
 * @route GET /api/orders
 * @access Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Apply filters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.isPaid) {
      query.isPaid = req.query.isPaid === "true";
    }

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders
    const orders = await Order.find(query)
      .populate("user", "id name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
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

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrders,
};
