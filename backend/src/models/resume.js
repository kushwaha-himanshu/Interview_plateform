import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    chromaCollectionId: {
      type: String,
      required: true,
      unique: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Resume =
  mongoose.models.Resume ||
  mongoose.model("Resume", resumeSchema);

export default Resume;