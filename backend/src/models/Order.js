import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    contactName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    division: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    upazila: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    area: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false },
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: String,
    alt: String,
  },
  { _id: false },
);

const proposedBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Used", "Fair"],
      required: true,
    },
    photos: {
      type: [imageSchema],
      validate: {
        validator(images) {
          return Array.isArray(images) && images.length >= 1 && images.length <= 4;
        },
        message: "Proposed book photos must be between 1 and 4",
      },
    },
    conditionNote: {
      type: String,
      trim: true,
      maxlength: 700,
    },
  },
  { _id: false },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sell", "exchange"],
      required: true,
    },
    bookPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookPost",
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerPickupInfo: {
      type: contactInfoSchema,
      required: true,
    },
    buyerDeliveryInfo: {
      type: contactInfoSchema,
      required: true,
    },
    buyerProposedBook: proposedBookSchema,
    sellerDecision: {
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "not_required"],
        default() {
          return this.type === "exchange" ? "pending" : "not_required";
        },
      },
      note: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      decidedAt: Date,
    },
    status: {
      type: String,
      enum: [
        "requested",
        "seller_accepted",
        "seller_rejected",
        "admin_review",
        "pickup_assigned",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "requested",
      index: true,
    },
    statusHistory: [statusHistorySchema],
    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    deliveryAgent: {
      name: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      phone: {
        type: String,
        trim: true,
        maxlength: 30,
      },
    },
  },
  { timestamps: true },
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
