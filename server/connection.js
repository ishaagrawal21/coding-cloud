const mongoose = require("mongoose");

// Direct (hard‑coded) MongoDB URL as requested
const MONGODB_URI = "mongodb://127.0.0.1:27017/school_books";

const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;


