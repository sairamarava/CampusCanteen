const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const MenuItem = require("../models/menuItem.model");

// Calculate cart total
const calculateCartTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItem);
    if (menuItem) {
      total += menuItem.price * item.quantity;
    }
  }
  return total;
};

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate({
      path: "cart.items.menuItem",
      select: "name price image isVegetarian isAvailable",
    });

    // Calculate total
    const total = await calculateCartTotal(user.cart.items);
    user.cart.totalAmount = total;
    await user.save();

    res.json({
      items: user.cart.items,
      totalAmount: user.cart.totalAmount,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
});

// Add item to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const user = req.user;

    // Verify menu item exists and is available
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ message: "Item is currently unavailable" });
    }

    // Find item in cart
    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.menuItem.toString() === itemId
    );

    if (cartItemIndex > -1) {
      // Update quantity if item exists
      user.cart.items[cartItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.items.push({
        menuItem: itemId,
        quantity: quantity,
      });
    }

    // Update total
    user.cart.totalAmount = await calculateCartTotal(user.cart.items);
    await user.save();

    // Return updated cart
    const updatedUser = await user.populate({
      path: "cart.items.menuItem",
      select: "name price image isVegetarian isAvailable",
    });

    res.json({
      items: updatedUser.cart.items,
      totalAmount: updatedUser.cart.totalAmount,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      message: "Error adding item to cart",
      error: error.message,
    });
  }
});

// Update item quantity
router.put("/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    // Validate quantity
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.menuItem.toString() === itemId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      user.cart.items.splice(cartItemIndex, 1);
    } else {
      // Update quantity
      user.cart.items[cartItemIndex].quantity = quantity;
    }

    // Update total
    user.cart.totalAmount = await calculateCartTotal(user.cart.items);
    await user.save();

    // Return updated cart
    const updatedUser = await user.populate({
      path: "cart.items.menuItem",
      select: "name price image isVegetarian isAvailable",
    });

    res.json({
      items: updatedUser.cart.items,
      totalAmount: updatedUser.cart.totalAmount,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      message: "Error updating cart",
      error: error.message,
    });
  }
});

// Remove item from cart
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = req.user;

    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.menuItem.toString() === itemId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove item
    user.cart.items.splice(cartItemIndex, 1);

    // Update total
    user.cart.totalAmount = await calculateCartTotal(user.cart.items);
    await user.save();

    // Return updated cart
    const updatedUser = await user.populate({
      path: "cart.items.menuItem",
      select: "name price image isVegetarian isAvailable",
    });

    res.json({
      items: updatedUser.cart.items,
      totalAmount: updatedUser.cart.totalAmount,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      message: "Error removing item from cart",
      error: error.message,
    });
  }
});

// Clear cart
router.delete("/", auth, async (req, res) => {
  try {
    const user = req.user;
    user.cart.items = [];
    user.cart.totalAmount = 0;
    await user.save();

    res.json({
      items: [],
      totalAmount: 0,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
});

module.exports = router;
