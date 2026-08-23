import mongoose from "mongoose";

const questionAnswerSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
    },

    evaluation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    askedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionAnswer =
  mongoose.models.QuestionAnswer ||
  mongoose.model(
    "QuestionAnswer",
    questionAnswerSchema
  );

export default QuestionAnswer;