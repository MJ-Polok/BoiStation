import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookPost",
      required: true,
    },
    lastMessage: {
      type: String,
      trim: true,
      maxlength: 240,
    },
    lastMessageAt: Date,
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    archivedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true },
);

conversationSchema.index({ buyer: 1, seller: 1, bookPost: 1 }, { unique: true });
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
