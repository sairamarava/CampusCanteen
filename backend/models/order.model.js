const mongoose = require("mongoose");

const dailyOrdersArchiveSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalOrders: Number,
  totalRevenue: Number,
  orderCount: {
    pending: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 }
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "CARD"],
      required: true,
      uppercase: true,
    },
    studentDetails: {
      rollNumber: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Update status history when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
const DailyOrdersArchive = mongoose.model("DailyOrdersArchive", dailyOrdersArchiveSchema);

module.exports = { Order, DailyOrdersArchive };
