const express = require("express");
const router = express.Router();
const {
  getAllMenuItems,
  getMenuCategories,
  getMenuItemById,
} = require("../controllers/menuController");

// Debug route
router.get("/debug", (req, res) => {
  res.json({
    message: "Menu routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// Get all menu items
router.get("/", getAllMenuItems);

// Get all menu categories
router.get("/categories", getMenuCategories);

// Get menu item by ID
router.get("/:id", getMenuItemById);

module.exports = router;
