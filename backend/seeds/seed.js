const mongoose = require("mongoose");
const MenuItem = require("../models/menuItem.model");

const menuItems = [
  {
    name: "Masala Dosa",
    description:
      "Crispy rice crepe served with potato masala, coconut chutney, and sambar",
    price: 60,
    category: "Breakfast",
    image:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778001/campus-canteen/masala-dosa.jpg",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 15,
    isAvailable: true,
  },
  {
    name: "Vada Pav",
    description: "Spiced potato patty in a bun with spicy green chutney",
    price: 30,
    category: "Snacks",
    image:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778002/campus-canteen/vada-pav.jpg",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant rice cooked with spiced chicken, served with raita",
    price: 120,
    category: "Lunch",
    image:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778003/campus-canteen/chicken-biryani.jpg",
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 25,
    isAvailable: true,
  },
  {
    name: "Cold Coffee",
    description: "Chilled coffee blended with ice cream",
    price: 50,
    category: "Beverages",
    image:
      "https://res.cloudinary.com/dj8mlkqzw/image/upload/v1635778004/campus-canteen/cold-coffee.jpg",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
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
