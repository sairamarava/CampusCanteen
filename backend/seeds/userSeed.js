require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const users = [
  {
    name: "Admin User",
    email: "admin@campuscanteen.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Test User",
    email: "test@example.com",
    password: "test123",
    role: "user",
  },
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB");

    // Clear existing users
    console.log("Clearing existing users...");
    await User.deleteMany({});
    console.log("Successfully cleared existing users");

    // Insert new users
    console.log("Inserting new users...");
    const insertedUsers = await Promise.all(
      users.map((user) => new User(user).save())
    );
    console.log("Successfully inserted users. Count:", insertedUsers.length);

    console.log("Database seeded with users");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
