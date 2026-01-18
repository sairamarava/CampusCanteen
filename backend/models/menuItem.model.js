const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Signature Wraps & Bites", "Wholesome Bowls & Greens", "The Brew Bar", "Sweet Indulgences", "Waffles", "Snacks"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number, // in minutes
      required: [true, "Preparation time is required"],
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating before saving
menuItemSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    this.averageRating =
      this.ratings.reduce((acc, item) => acc + item.rating, 0) /
      this.ratings.length;
  }
  next();
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
