import mongoose from "mongoose";

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

const officialBookSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["open-library", "google-books", "manual"],
    },
    sourceId: String,
    coverUrl: String,
    title: String,
    author: String,
    description: String,
  },
  { _id: false },
);

const wantedBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    officialBook: officialBookSchema,
    frontImage: imageSchema,
  },
  { _id: false },
);

const pickupInfoSchema = new mongoose.Schema(
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

const bookPostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sell", "exchange", "donate"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "sold", "exchanged", "unavailable"],
      default: "active",
    },
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Used", "Fair", "Poor"],
      required: true,
    },
    officialBook: officialBookSchema,
    frontImage: {
      type: imageSchema,
      required: true,
    },
    sellerImages: {
      type: [imageSchema],
      required: true,
      validate: {
        validator(images) {
          return Array.isArray(images) && images.length >= 1 && images.length <= 4;
        },
        message: "Seller images must be between 1 and 4",
      },
    },
    price: {
      type: Number,
      min: 0,
      required() {
        return this.type === "sell";
      },
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
    priceReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    pricingRuleAccepted: {
      type: Boolean,
      default: false,
    },
    wantedBook: {
      type: wantedBookSchema,
      required() {
        return this.type === "exchange";
      },
    },
    officialDescription: {
      type: String,
      trim: true,
      maxlength: 1500,
    },
    sellerNote: {
      type: String,
      trim: true,
      maxlength: 1200,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    pickupInfo: {
      type: pickupInfoSchema,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

bookPostSchema.index({ type: 1, status: 1, category: 1, createdAt: -1 });
bookPostSchema.index({ title: "text", author: "text", category: "text" });

export const BookPost = mongoose.model("BookPost", bookPostSchema);
