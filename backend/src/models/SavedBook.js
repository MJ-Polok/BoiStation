import mongoose from "mongoose";

const savedBookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookPost",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

savedBookSchema.index({ user: 1, bookPost: 1 }, { unique: true });

export const SavedBook = mongoose.model("SavedBook", savedBookSchema);
