import mongoose from "mongoose";

const labTaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
  },
  flag: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 100,
  },
});

const labsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: String,
      default: "20 mins",
    },
    xpReward: {
      type: Number,
      default: 200,
    },
    category: {
      type: String,
      default: "General",
    },
    targetIp: {
      type: String,
      trim: true,
    },
    vulnerableServices: {
      type: [String],
      default: [],
    },
    instructions: {
      type: String,
    },
    tasks: {
      type: [labTaskSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Labs = mongoose.models.Labs || mongoose.model("Labs", labsSchema);

export default Labs;
