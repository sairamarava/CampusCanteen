const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuItem.model");
const { auth } = require("../middleware/auth.middleware");

// Get menu categories
router.get("/categories", async (req, res) => {
  try {
    console.log("Fetching categories...");
    const categories = await MenuItem.distinct("category");
    console.log("Found categories:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Error in /categories:", error);
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const { category, isVegetarian, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isVegetarian === "true") {
      query.isVegetarian = true;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    console.log("Fetching menu items with query:", query);
    const count = await MenuItem.countDocuments(query);
    console.log("Total matching documents:", count);

    const menuItems = await MenuItem.find(query)
      .select(
        "name description price category image imageUrl isVegetarian isAvailable isSpicy preparationTime averageRating"
      )
      .sort("-averageRating");

    console.log("Found menu items:", menuItems.length);
    res.json(menuItems);
  } catch (error) {
    console.error("Error in / (menu items):", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
      error: error.message,
    });
  }
});

// Get menu item by ID
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      "ratings.user",
      "name"
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu item",
      error: error.message,
    });
  }
});

// Add rating and review
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Check if user has already rated
    const existingRating = menuItem.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      existingRating.date = new Date();
    } else {
      menuItem.ratings.push({
        user: req.user._id,
        rating,
        review,
      });
    }

    await menuItem.save();

    res.json({
      success: true,
      message: "Rating added successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding rating",
      error: error.message,
    });
  }
});

module.exports = router;
