const MenuItem = require("../models/menuItem.model");

// Static menu items data (fallback when DB is empty)
const staticMenuItems = [
  // SIGNATURE WRAPS & BITES
  {
    name: "Classic Grilled Sandwich",
    description: "Perfectly grilled sandwich with fresh vegetables and cheese, toasted to golden perfection",
    price: 35,
    category: "Signature Wraps & Bites",
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
  },
  {
    name: "Garden Fresh Vegetable Roll",
    description: "Crispy roll stuffed with fresh garden vegetables and aromatic spices",
    price: 40,
    category: "Signature Wraps & Bites",
    imageUrl: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 12,
  },
  {
    name: "Farm-Style Egg Roll",
    description: "Fluffy egg wrap with fresh herbs and a hint of spice",
    price: 40,
    category: "Signature Wraps & Bites",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 10,
  },
  {
    name: "Savory Chicken Roll",
    description: "Tender chicken pieces wrapped in a crispy roll with signature spices",
    price: 45,
    category: "Signature Wraps & Bites",
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 15,
  },
  {
    name: "Perfectly Poached Egg",
    description: "Delicately poached egg served with buttered toast and fresh herbs",
    price: 30,
    category: "Signature Wraps & Bites",
    imageUrl: "https://images.unsplash.com/photo-1482049016gy-bdb8b8b5cf8?w=800",
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 8,
  },
  // WHOLESOME BOWLS & GREENS
  {
    name: "Fruity Morning Oats",
    description: "Wholesome oats topped with fresh seasonal fruits and honey drizzle",
    price: 45,
    category: "Wholesome Bowls & Greens",
    imageUrl: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
  },
  {
    name: "Savory Masala Oats",
    description: "Indian-style spiced oats with vegetables and aromatic masala",
    price: 45,
    category: "Wholesome Bowls & Greens",
    imageUrl: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 10,
  },
  {
    name: "Tropical Fruit Bowl",
    description: "Fresh tropical fruits beautifully arranged with a mint garnish",
    price: 40,
    category: "Wholesome Bowls & Greens",
    imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  {
    name: "Crisp Green Salad",
    description: "Fresh crisp greens with cherry tomatoes, cucumber, and light vinaigrette",
    price: 30,
    category: "Wholesome Bowls & Greens",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  // THE BREW BAR
  {
    name: "Artisanal Masala Chai",
    description: "Traditional Indian chai brewed with aromatic spices and fresh milk",
    price: 20,
    category: "The Brew Bar",
    imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  {
    name: "Classic Filter Coffee",
    description: "Authentic South Indian filter coffee, strong and aromatic",
    price: 15,
    category: "The Brew Bar",
    imageUrl: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  {
    name: "Freshly Squeezed Fruit Nectar",
    description: "Fresh seasonal fruits squeezed to perfection, pure and refreshing",
    price: 50,
    category: "The Brew Bar",
    imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 7,
  },
  // SWEET INDULGENCES
  {
    name: "Delicate Strawberry Slice",
    description: "Light and creamy strawberry cake slice with fresh strawberry topping",
    price: 30,
    category: "Sweet Indulgences",
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 3,
  },
  {
    name: "Decadent Chocolate Treat",
    description: "Rich and indulgent chocolate dessert that melts in your mouth",
    price: 35,
    category: "Sweet Indulgences",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 3,
  },
];

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    console.log("Fetching menu items...");
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

    const menuItems = await MenuItem.find(query)
      .select(
        "name description price category image imageUrl isVegetarian isAvailable isSpicy preparationTime averageRating"
      )
      .sort("-averageRating");

    console.log(`Found ${menuItems.length} menu items`);
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error in getAllMenuItems:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
      error: error.message,
    });
  }
};

// Get all menu categories
const getMenuCategories = async (req, res) => {
  try {
    console.log("Fetching categories...");
    const categories = await MenuItem.distinct("category");
    console.log("Available categories:", categories);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getMenuCategories:", error);
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const item = staticMenuItems.find((item) => item._id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu item", error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuCategories,
  getMenuItemById,
};
