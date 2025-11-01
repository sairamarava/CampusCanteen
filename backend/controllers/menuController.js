const MenuItem = require("../models/menuItem.model");

// Static menu items data
const staticMenuItems = [
  {
    name: "Masala Dosa",
    description:
      "Crispy rice crepe served with potato masala, coconut chutney, and sambar",
    price: 60,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778001/campus-canteen/masala-dosa.jpg",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 15,
  },
  {
    name: "Vada Pav",
    description: "Spiced potato patty in a bun with spicy green chutney",
    price: 30,
    category: "Snacks",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778002/campus-canteen/vada-pav.jpg",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 10,
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant rice cooked with spiced chicken, served with raita",
    price: 120,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778003/campus-canteen/chicken-biryani.jpg",
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 25,
  },
  {
    name: "Cold Coffee",
    description: "Chilled coffee blended with ice cream",
    price: 50,
    category: "Beverages",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778004/campus-canteen/cold-coffee.jpg",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  {
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 15,
    category: "Snacks",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778005/campus-canteen/samosa.jpg",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 8,
  },
  {
    name: "Thali",
    description: "Complete meal with rice, rotis, dal, sabzi, and dessert",
    price: 100,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778006/campus-canteen/thali.jpg",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 20,
  },
  {
    name: "Maggi",
    description: "Classic instant noodles with vegetables",
    price: 40,
    category: "Snacks",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778007/campus-canteen/maggi.jpg",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 10,
  },
  {
    name: "Tea",
    description: "Indian masala chai",
    price: 15,
    category: "Beverages",
    imageUrl:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778008/campus-canteen/tea.jpg",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
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
