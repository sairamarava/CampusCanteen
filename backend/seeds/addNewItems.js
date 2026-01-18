const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MenuItem = require("../models/menuItem.model");

const newMenuItems = [
  // WAFFLES
  {
    name: "White Chocolate Waffle",
    description: "Delicious waffle drizzled with premium white chocolate sauce",
    price: 50,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  {
    name: "Dark Chocolate Waffle",
    description: "Crispy waffle topped with rich dark chocolate sauce",
    price: 50,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  {
    name: "Milk Chocolate Waffle",
    description: "Classic waffle with smooth milk chocolate topping",
    price: 50,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1459789034005-ba29c5783491?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  {
    name: "Triple Chocolate Waffle",
    description: "Ultimate indulgence with white, milk, and dark chocolate layers",
    price: 50,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1568051243858-533a607809a5?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Crunchy Kit Kat Waffle",
    description: "Crispy waffle loaded with crunchy Kit Kat pieces and chocolate sauce",
    price: 60,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Oreo Loaded Waffle",
    description: "Waffle topped with crushed Oreo cookies and cream",
    price: 60,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Nutella Waffle",
    description: "Golden waffle generously spread with creamy Nutella",
    price: 65,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1509482560494-4126f8225994?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  {
    name: "Dry Fruit Waffle",
    description: "Healthy waffle topped with assorted dry fruits and honey",
    price: 60,
    category: "Waffles",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  // SNACKS
  {
    name: "French Fries",
    description: "Crispy golden french fries seasoned with special spices",
    price: 50,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    isAvailable: true,
  },
  {
    name: "Momos",
    description: "Steamed dumplings filled with fresh vegetables, served with spicy chutney",
    price: 70,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800",
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 15,
    isAvailable: true,
  },
  {
    name: "Twister",
    description: "Crispy twisted potato snack with tangy seasoning",
    price: 50,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 8,
    isAvailable: true,
  },
  // SWEET INDULGENCES (Additional desserts)
  {
    name: "Mr Brofills Special Dates with Nuts",
    description: "Premium dates stuffed with assorted nuts, a healthy indulgence",
    price: 70,
    category: "Sweet Indulgences",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    isAvailable: true,
  },
  {
    name: "London Strawberry",
    description: "Fresh strawberries with creamy London-style dessert topping",
    price: 70,
    category: "Sweet Indulgences",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    isAvailable: true,
  },
  {
    name: "Banana Desert",
    description: "Caramelized banana dessert with vanilla cream and chocolate drizzle",
    price: 70,
    category: "Sweet Indulgences",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800",
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 7,
    isAvailable: true,
  },
];

const addNewItems = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/campus-canteen";
    
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    console.log(`Adding ${newMenuItems.length} new items to the menu...`);
    
    // Check for existing items to avoid duplicates
    for (const item of newMenuItems) {
      const existingItem = await MenuItem.findOne({ name: item.name });
      if (existingItem) {
        console.log(`Item "${item.name}" already exists, skipping...`);
      } else {
        await MenuItem.create(item);
        console.log(`Added: ${item.name} - ₹${item.price}`);
      }
    }

    console.log("\nNew menu items added successfully!");
    
    // Show total count
    const totalItems = await MenuItem.countDocuments();
    console.log(`Total menu items now: ${totalItems}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error adding menu items:", error);
    process.exit(1);
  }
};

addNewItems();
