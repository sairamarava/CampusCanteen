const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/order.model");
const MenuItem = require("../models/menuItem.model");
const Notification = require("../models/notification.model");
const { auth } = require("../middleware/auth.middleware");

// Helper function to generate order number
const generateOrderNumber = async () => {
  const date = new Date();
  const prefix =
    date.getFullYear().toString().slice(-2) +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");

  // Get the last order number for today
  const lastOrder = await Order.findOne(
    {
      orderNumber: { $regex: `^${prefix}` },
    },
    { orderNumber: 1 },
    { sort: { orderNumber: -1 } }
  );

  let sequence = 1;
  if (lastOrder) {
    sequence = parseInt(lastOrder.orderNumber.slice(-4)) + 1;
  }

  return `${prefix}${sequence.toString().padStart(4, "0")}`;
};

// Create new order
router.post("/", auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod, studentDetails } = req.body;

    // Generate unique order number
    const orderNumber = await generateOrderNumber();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.menuItem) {
        return res.status(400).json({
          success: false,
          message: "Missing menu item ID",
        });
      }

      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is currently unavailable`,
        });
      }

      const quantity = parseInt(item.quantity) || 1;
      const price = parseFloat(menuItem.price);
      const itemTotal = price * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: quantity,
        price: price,
        name: menuItem.name, // Add name for reference
      });

      // Update menu item order count
      menuItem.totalOrders += quantity;
      await menuItem.save({ session });
    }

    // Validate studentDetails
    if (!studentDetails || !studentDetails.rollNumber || !studentDetails.name) {
      return res.status(400).json({
        success: false,
        message: "Student details are required",
      });
    }

    // Create order with proper paymentMethod value
    const order = new Order({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod.toUpperCase(), // Convert to uppercase to match enum
      studentDetails,
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60000), // 15 minutes from now
    });

    await order.save({ session });

    // Add order to user's orders and update order count
    req.user.orders.push(order._id);
    req.user.orderCount = (req.user.orderCount || 0) + 1;
    await req.user.save({ session });

    // Create a notification for admin
    const notification = new Notification({
      type: "NEW_ORDER",
      title: "New Order Received",
      message: `New order #${order.orderNumber} from ${studentDetails.name}`,
      order: order._id,
      isRead: false,
    });
    await notification.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Populate order details for response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.menuItem", "name price image")
      .populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Handle different types of errors
    if (error.code === 11000) {
      // Duplicate order number
      res.status(500).json({
        success: false,
        message: "Order creation failed. Please try again.",
        error: "Duplicate order number",
      });
    } else if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Invalid order data",
        error: Object.values(error.errors).map((err) => err.message),
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  }
});

// Get user's orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem", "name price image")
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// Get order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.menuItem", "name price image")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
});

// Update order status
router.put("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update order status",
      });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Create notification for status change
    const notification = new Notification({
      type: "ORDER_UPDATED",
      title: "Order Status Updated",
      message: `Your order #${order.orderNumber} status has been updated to ${status}`,
      order: order._id,
      user: order.user._id,
      isRead: false,
    });
    await notification.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
});

// Cancel order
router.post("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is authorized to cancel this order
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (!["Pending", "Preparing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
});

module.exports = router;
