const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MenuItem = require("../models/menuItem.model");

const imageUpdates = [
  {
    name: "Dark Chocolate Waffle",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800"
  },
  {
    name: "Crunchy Kit Kat Waffle",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800"
  },
  {
    name: "Oreo Loaded Waffle",
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800"
  }
];

const fixImages = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/campus-canteen";
    
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    for (const update of imageUpdates) {
      const result = await MenuItem.findOneAndUpdate(
        { name: update.name },
        { image: update.image },
        { new: true }
      );
      if (result) {
        console.log(`Updated image for: ${update.name}`);
      } else {
        console.log(`Item not found: ${update.name}`);
      }
    }

    console.log("\nImage URLs fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing images:", error);
    process.exit(1);
  }
};

fixImages();
