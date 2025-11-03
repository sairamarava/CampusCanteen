const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const MenuItem = require("../models/menuItem.model");
const { Order, DailyOrdersArchive } = require("../models/order.model");
const User = require("../models/User");
const PDFDocument = require("pdfkit");

// Function to archive orders at the end of day
const archiveDailyOrders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    createdAt: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const orderCounts = orders.reduce(
    (acc, order) => {
      acc[order.status.toLowerCase()]++;
      return acc;
    },
    { pending: 0, delivered: 0, cancelled: 0 }
  );

  const archive = new DailyOrdersArchive({
    date: today,
    totalOrders: orders.length,
    totalRevenue,
    orderCount: orderCounts,
    orders: orders.map((order) => order._id),
  });

  await archive.save();

  // Reset pending orders
  await Order.updateMany(
    { status: "Pending" },
    { $set: { status: "Cancelled" } }
  );
};

// Schedule daily archival
const scheduleDailyArchive = () => {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );
  const msToMidnight = night.getTime() - now.getTime();

  setTimeout(async () => {
    await archiveDailyOrders();
    scheduleDailyArchive();
  }, msToMidnight);
};

// Start the scheduling
scheduleDailyArchive();

// Add new menu item
router.post("/menu", adminAuth, async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding menu item",
      error: error.message,
    });
  }
});

// Update menu item
router.put("/menu/:id", adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
      error: error.message,
    });
  }
});

// Delete menu item
router.delete("/menu/:id", adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
      error: error.message,
    });
  }
});

// Get all orders with optional date filtering
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (date) {
      // Create date at UTC midnight
      const startDate = new Date(date + "T00:00:00Z");
      const endDate = new Date(date + "T23:59:59.999Z");
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.menuItem", "name price")
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

// Update order status
router.put("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    if (status === "Delivered") {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

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

// Get dashboard statistics
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      totalRevenue,
      todayRevenue,
      totalUsers,
      popularItems,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: "Pending" }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      User.countDocuments({ role: "user" }),
      MenuItem.find().sort("-totalOrders").limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalUsers,
        popularItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
});

// Get daily archive
router.get("/daily-archive/:date", adminAuth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const archive = await DailyOrdersArchive.findOne({ date }).populate({
      path: "orders",
      populate: [
        { path: "user", select: "name email" },
        { path: "items.menuItem", select: "name price" },
      ],
    });

    if (!archive) {
      return res.status(404).json({
        success: false,
        message: "No data found for this date",
      });
    }

    res.json({
      success: true,
      archive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching daily archive",
      error: error.message,
    });
  }
});

// Generate PDF report
router.get("/daily-report/:date", adminAuth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const archive = await DailyOrdersArchive.findOne({ date }).populate({
      path: "orders",
      populate: [
        { path: "user", select: "name email" },
        { path: "items.menuItem", select: "name price" },
      ],
    });

    if (!archive) {
      return res.status(404).json({
        success: false,
        message: "No data found for this date",
      });
    }

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=daily-report-${req.params.date}.pdf`
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text("Campus Canteen - Daily Order Report", { align: "center" })
      .fontSize(16)
      .text(`Date: ${req.params.date}`, { align: "center" })
      .moveDown(2);

    // Summary
    doc
      .fontSize(14)
      .text("Daily Summary", { underline: true })
      .moveDown()
      .fontSize(12)
      .text(`Total Orders: ${archive.totalOrders}`)
      .text(`Total Revenue: ₹${archive.totalRevenue.toFixed(2)}`)
      .moveDown()
      .text("Order Status Breakdown:", { underline: true })
      .text(`Pending Orders: ${archive.orderCount.pending}`)
      .text(`Delivered Orders: ${archive.orderCount.delivered}`)
      .text(`Cancelled Orders: ${archive.orderCount.cancelled}`)
      .moveDown(2);

    // Orders Detail
    doc.fontSize(14).text("Order Details", { underline: true }).moveDown();

    archive.orders.forEach((order) => {
      doc
        .fontSize(12)
        .text(`Order #${order.orderNumber}`)
        .text(`Customer: ${order.user?.name}`)
        .text(`Status: ${order.status}`)
        .text(`Amount: ₹${order.totalAmount.toFixed(2)}`)
        .text("Items:");

      order.items.forEach((item) => {
        doc.text(
          `  - ${item.menuItem?.name} x ${item.quantity} (₹${item.price})`
        );
      });

      doc.moveDown();
    });

    // Footer
    doc
      .fontSize(10)
      .text("Generated on: " + new Date().toLocaleString(), { align: "right" });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating PDF report",
      error: error.message,
    });
  }
});

// Generate PDF report for a specific date
router.get("/orders/report/:date", adminAuth, async (req, res) => {
  try {
    // Parse date and set to start of day
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    // Fetch orders for the specified date
    const orders = await Order.find({
      createdAt: { $gte: date, $lt: endDate },
    }).populate("user items.menuItem");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this date",
      });
    }

    // Calculate daily statistics
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      statusCounts: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}),
    };

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=campus-canteen-report-${req.params.date}.pdf`
    );
    doc.pipe(res);

    // Title and Date
    doc
      .fontSize(24)
      .text("Campus Canteen", { align: "center" })
      .fontSize(18)
      .text(`Daily Report - ${req.params.date}`, { align: "center" })
      .moveDown(2);

    // Daily Summary
    doc
      .fontSize(14)
      .text("Daily Summary", { underline: true })
      .moveDown()
      .fontSize(12)
      .text(`Total Orders: ${stats.totalOrders}`)
      .text(`Total Revenue: ₹${stats.totalRevenue.toFixed(2)}`)
      .moveDown()
      .text("Order Status Breakdown:")
      .text(`  • Pending: ${stats.statusCounts["Pending"] || 0}`)
      .text(`  • Delivered: ${stats.statusCounts["Delivered"] || 0}`)
      .text(`  • Cancelled: ${stats.statusCounts["Cancelled"] || 0}`)
      .moveDown(2);

    // Order Details
    doc.fontSize(14).text("Order Details", { underline: true }).moveDown();

    orders.forEach((order, index) => {
      doc
        .fontSize(12)
        .text(`Order #${index + 1}: ${order.orderNumber}`)
        .text(`Status: ${order.status}`)
        .text(`Customer: ${order.user ? order.user.name : "N/A"}`)
        .text("Items:");

      order.items.forEach((item) => {
        doc.text(
          `  • ${item.menuItem ? item.menuItem.name : "Unknown Item"} x ${
            item.quantity
          }`
        );
      });

      doc
        .text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`)
        .text(`Order Time: ${order.createdAt.toLocaleTimeString()}`)
        .moveDown();
    });

    // Footer
    doc
      .moveDown()
      .fontSize(10)
      .text(`Report generated on ${new Date().toLocaleString()}`, {
        align: "right",
      });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating PDF report",
      error: error.message,
    });
  }
});

module.exports = router;
