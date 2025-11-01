const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth.middleware");
const bcrypt = require("bcryptjs");

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
});

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
});

// Add item to favorites
router.post("/favorites/:menuItemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const menuItemId = req.params.menuItemId;

    if (!user.favoriteItems.includes(menuItemId)) {
      user.favoriteItems.push(menuItemId);
      await user.save();
    }

    res.json({
      success: true,
      message: "Item added to favorites",
      favoriteItems: user.favoriteItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to favorites",
      error: error.message,
    });
  }
});

// Remove item from favorites
router.delete("/favorites/:menuItemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const menuItemId = req.params.menuItemId;

    user.favoriteItems = user.favoriteItems.filter(
      (item) => item.toString() !== menuItemId
    );
    await user.save();

    res.json({
      success: true,
      message: "Item removed from favorites",
      favoriteItems: user.favoriteItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from favorites",
      error: error.message,
    });
  }
});

// Get favorite items
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favoriteItems",
      "name price image category isAvailable"
    );

    res.json({
      success: true,
      favoriteItems: user.favoriteItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching favorites",
      error: error.message,
    });
  }
});

module.exports = router;
