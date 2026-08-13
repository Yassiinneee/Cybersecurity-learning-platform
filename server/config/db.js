import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Stop the app immediately if MONGODB_URI is missing
if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not set in environment variables!");
}

export async function connectDatabase() {
  // Return existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB is down
    });

    console.log("💚 [MongoDB] Connected successfully.");
  } catch (error) {
    console.error("❌ [MongoDB] Connection failed:", error.message);
    process.exit(1); // Exit process on failed DB connection
  }
}

// Clean up connection when app shuts down
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default mongoose;
