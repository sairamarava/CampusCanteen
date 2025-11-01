require("dotenv").config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // MongoDB Configuration
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/campus-canteen",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",

  // Frontend URL for CORS
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Cookie Configuration
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE || 30, // days

  // Admin Configuration
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@campuscanteen.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",

  // Order Configuration
  PREPARATION_TIME: process.env.PREPARATION_TIME || 30, // minutes
};
