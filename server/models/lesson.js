import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
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
    duration: {
      type: String,
      default: "15 mins",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    interactiveDiagramType: {
      type: String,
      trim: true,
    },
    readingMaterial: {
      type: String,
      required: true,
    },
    practicalTask: {
      instruction: String,
      targetIp: String,
      hint: String,
      flagRequired: {
        type: Boolean,
        default: false,
      },
      flag: String,
    },
    // Reference to quizzes for this lesson
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizz",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);

export default Lesson;
