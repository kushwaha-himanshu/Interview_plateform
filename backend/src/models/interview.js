import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
      sessionId: {
    type: String,
    required: true,
  },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    currentQuestion: {
      type: String,
      default: null,
    },
    overallScore: {
      type: Number,
      default: null,
    },

    questionsAnswered: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },

    interviewerStyle: {
      type: String,
      enum: ["Friendly", "Professional", "Technical", "Stress Mode"],
      default: "Professional",
    },

    duration: {
      type: String,
      enum: ["15 min", "30 min", "45 min"],
      default: "30 min",
    },

    totalQuestions: {
      type: Number,
      default: 5,
    },

    currentQuestionNumber: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Interview =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);

export default Interview;