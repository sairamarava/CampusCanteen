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
  {
    name: "Mr Brofills Special Dates with Nuts",
    description: "Premium dates stuffed with assorted nuts, a healthy indulgence",
    price: 70,
    category: "Sweet Indulgences",
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  {
    name: "London Strawberry",
    description: "Fresh strawberries with creamy London-style dessert topping",
    price: 70,
    category: "Sweet Indulgences",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
  },
  {
    name: "Banana Desert",
    description: "Caramelized banana dessert with vanilla cream and chocolate drizzle",
    price: 70,
    category: "Sweet Indulgences",
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 7,
  },
  // WAFFLES
  {
    name: "White Chocolate Waffle",
    description: "Delicious waffle drizzled with premium white chocolate sauce",
    price: 50,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
  },
  {
    name: "Dark Chocolate Waffle",
    description: "Crispy waffle topped with rich dark chocolate sauce",
    price: 50,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
  },
  {
    name: "Milk Chocolate Waffle",
    description: "Classic waffle with smooth milk chocolate topping",
    price: 50,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1459789034005-ba29c5783491?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
  },
  {
    name: "Triple Chocolate Waffle",
    description: "Ultimate indulgence with white, milk, and dark chocolate layers",
    price: 50,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1568051243858-533a607809a5?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
  },
  {
    name: "Crunchy Kit Kat Waffle",
    description: "Crispy waffle loaded with crunchy Kit Kat pieces and chocolate sauce",
    price: 60,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
  },
  {
    name: "Oreo Loaded Waffle",
    description: "Waffle topped with crushed Oreo cookies and cream",
    price: 60,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
  },
  {
    name: "Nutella Waffle",
    description: "Golden waffle generously spread with creamy Nutella",
    price: 65,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1509482560494-4126f8225994?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
  },
  {
    name: "Dry Fruit Waffle",
    description: "Healthy waffle topped with assorted dry fruits and honey",
    price: 60,
    category: "Waffles",
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
  },
  // SNACKS
  {
    name: "French Fries",
    description: "Crispy golden french fries seasoned with special spices",
    price: 50,
    category: "Snacks",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
  },
  {
    name: "Momos",
    description: "Steamed dumplings filled with fresh vegetables, served with spicy chutney",
    price: 70,
    category: "Snacks",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 15,
  },
  {
    name: "Twister",
    description: "Crispy twisted potato snack with tangy seasoning",
    price: 50,
    category: "Snacks",
    imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
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
