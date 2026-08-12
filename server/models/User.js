import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/undefined values for local users
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Optional because Google OAuth users won't have a local password
    },
    role: {
      type: String,
      default: "Student",
    },
    status: {
      type: String,
      default: "Active",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: String,
      default: () => new Date().toLocaleDateString(),
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    completedLabs: {
      type: [String],
      default: [],
    },
    solvedCtfs: {
      type: [String],
      default: [],
    },
    unlockedAchievements: {
      type: [String],
      default: [],
    },
    savedNotes: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation errors in dev mode HMR
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;