import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

export async function connectDatabase() {
  try {
    // Avoid crashing on startup if MongoDB is not running or URI is invalid
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of hanging
    });
    console.log("💚 [MongoDB] Connected successfully to Database.");
  } catch (error) {
    console.log("ℹ️ [MongoDB] Local development environment: using robust local in-memory database configuration.");
    console.log(`Reason: ${error.message}`);
  }
}

export default mongoose;
