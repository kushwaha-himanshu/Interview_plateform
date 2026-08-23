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
  },
  {
    timestamps: true,
  }
);

const Interview =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);

export default Interview;