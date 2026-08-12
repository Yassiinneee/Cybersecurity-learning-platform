import mongoose from "mongoose";

const quizzSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lessonId: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["mcq", "fill-blank", "log-analysis", "match"],
      default: "mcq",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      trim: true,
    },
    logContent: {
      type: String,
      trim: true,
    },
    pairs: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Quizz = mongoose.models.Quizz || mongoose.model("Quizz", quizzSchema);

export default Quizz;
