const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Initialize empty cart for testing
const carts = new Map();

// Get cart items
router.get("/", auth, (req, res) => {
  try {
    const userId = req.user.id;
    const cart = carts.get(userId) || [];
    res.json({ items: cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/add", auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity = 1, item } = req.body;

    let cart = carts.get(userId) || [];
    const existingItem = cart.find((item) => item._id === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Store complete item details
      cart.push({
        _id: itemId,
        quantity,
        name: item?.name,
        price: item?.price,
        imageUrl: item?.imageUrl || item?.image,
        ...item,
      });
    }

    carts.set(userId, cart);
    res.json({ items: cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

// Remove item from cart
router.delete("/:itemId", auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    let cart = carts.get(userId) || [];
    cart = cart.filter((item) => item._id !== itemId);

    carts.set(userId, cart);
    res.json({ items: cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
});

// Update item quantity
router.put("/:itemId", auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = carts.get(userId) || [];
    const item = cart.find((item) => item._id === itemId);

    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        cart = cart.filter((item) => item._id !== itemId);
      }
    }

    carts.set(userId, cart);
    res.json({ items: cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item" });
  }
});

// Clear cart
router.delete("/", auth, (req, res) => {
  try {
    const userId = req.user.id;
    carts.delete(userId);
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;
