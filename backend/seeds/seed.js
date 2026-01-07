const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MenuItem = require("../models/menuItem.model");

const menuItems = [
  // SIGNATURE WRAPS & BITES
  {
    name: "Classic Grilled Sandwich",
    description: "Perfectly grilled sandwich with fresh vegetables and cheese, toasted to golden perfection",
    price: 35,
    category: "Signature Wraps & Bites",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Garden Fresh Vegetable Roll",
    description: "Crispy roll stuffed with fresh garden vegetables and aromatic spices",
    price: 40,
    category: "Signature Wraps & Bites",
    image: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 12,
    isAvailable: true,
  },
  {
    name: "Farm-Style Egg Roll",
    description: "Fluffy egg wrap with fresh herbs and a hint of spice, farm-style preparation",
    price: 40,
    category: "Signature Wraps & Bites",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Savory Chicken Roll",
    description: "Tender chicken pieces wrapped in a crispy roll with signature spices",
    price: 45,
    category: "Signature Wraps & Bites",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 15,
    isAvailable: true,
  },
  {
    name: "Perfectly Poached Egg",
    description: "Delicately poached egg served with buttered toast and fresh herbs",
    price: 30,
    category: "Signature Wraps & Bites",
    image: "https://images.unsplash.com/photo-1482049016gy-bdb8b8b5cf8?w=800",
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  // WHOLESOME BOWLS & GREENS
  {
    name: "Fruity Morning Oats",
    description: "Wholesome oats topped with fresh seasonal fruits and honey drizzle",
    price: 45,
    category: "Wholesome Bowls & Greens",
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  {
    name: "Savory Masala Oats",
    description: "Indian-style spiced oats with vegetables and aromatic masala",
    price: 45,
    category: "Wholesome Bowls & Greens",
    image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Tropical Fruit Bowl",
    description: "Fresh tropical fruits beautifully arranged with a mint garnish",
    price: 40,
    category: "Wholesome Bowls & Greens",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    isAvailable: true,
  },
  {
    name: "Crisp Green Salad",
    description: "Fresh crisp greens with cherry tomatoes, cucumber, and light vinaigrette",
    price: 30,
    category: "Wholesome Bowls & Greens",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    isAvailable: true,
  },
  // THE BREW BAR
  {
    name: "Artisanal Masala Chai",
    description: "Traditional Indian chai brewed with aromatic spices and fresh milk",
    price: 20,
    category: "The Brew Bar",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    isAvailable: true,
  },
  {
    name: "Classic Filter Coffee",
    description: "Authentic South Indian filter coffee, strong and aromatic",
    price: 15,
    category: "The Brew Bar",
    image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    isAvailable: true,
  },
  {
    name: "Freshly Squeezed Fruit Nectar",
    description: "Fresh seasonal fruits squeezed to perfection, pure and refreshing",
    price: 50,
    category: "The Brew Bar",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 7,
    isAvailable: true,
  },
  // SWEET INDULGENCES
  {
    name: "Delicate Strawberry Slice",
    description: "Light and creamy strawberry cake slice with fresh strawberry topping",
    price: 30,
    category: "Sweet Indulgences",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 3,
    isAvailable: true,
  },
  {
    name: "Decadent Chocolate Treat",
    description: "Rich and indulgent chocolate dessert that melts in your mouth",
    price: 35,
    category: "Sweet Indulgences",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 3,
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("Attempting to connect to MongoDB...");
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/campus-canteen";
    console.log("Connection URI:", uri);

    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");

    // Verify connection by listing databases
    const admin = mongoose.connection.db.admin();
    const dbInfo = await admin.listDatabases();
    console.log(
      "Available databases:",
      dbInfo.databases.map((db) => db.name)
    );

    // Get current database name
    const currentDb = mongoose.connection.db.databaseName;
    console.log("Current database:", currentDb);

    // Clear existing menu items
    console.log("Clearing existing menu items...");
    const deleteResult = await MenuItem.deleteMany({});
    console.log("Clear result:", deleteResult);

    // Insert new menu items
    console.log("Inserting new menu items...");
    console.log("Items to insert:", menuItems.length);
    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log("Inserted items:", JSON.stringify(insertedItems, null, 2));

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
