import { BookPost } from "../models/BookPost.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const ACTIVE_STATUSES = ["active"];

function buildBookFilter(query) {
  const filter = { status: { $in: ACTIVE_STATUSES } };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.condition) filter.condition = query.condition;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
}

function validateBookPayload(payload) {
  if (payload.type === "donate") {
    return "Donation posting is coming soon";
  }

  if (!["sell", "exchange"].includes(payload.type)) {
    return "Post type must be sell or exchange";
  }

  if (!payload.title?.trim()) return "Book title is required";
  if (!payload.author?.trim()) return "Book author is required";
  if (!payload.category?.trim()) return "Category is required";
  if (!payload.condition?.trim()) return "Condition is required";
  if (!payload.location?.trim()) return "Location is required";
  if (!payload.frontImage?.url) return "Front image is required";
  if (!payload.pickupInfo?.contactName?.trim()) return "Pickup contact name is required";
  if (!payload.pickupInfo?.phone?.trim()) return "Pickup phone is required";
  if (!payload.pickupInfo?.division?.trim()) return "Pickup division is required";
  if (!payload.pickupInfo?.district?.trim()) return "Pickup district is required";
  if (!payload.pickupInfo?.upazila?.trim()) return "Pickup upazila or thana is required";
  if (!payload.pickupInfo?.area?.trim()) return "Pickup area is required";
  if (!payload.pickupInfo?.address?.trim()) return "Pickup address is required";

  if (!Array.isArray(payload.sellerImages) || payload.sellerImages.length < 1 || payload.sellerImages.length > 4) {
    return "Seller images must be between 1 and 4";
  }

  if (payload.type === "sell" && (payload.price === undefined || payload.price === null || Number(payload.price) < 0)) {
    return "Price is required for sell posts";
  }

  if (payload.type === "sell" && payload.pricingRuleAccepted !== true) {
    return "Pricing rule confirmation is required for sell posts";
  }

  if (payload.type === "exchange") {
    if (!payload.wantedBook?.title?.trim() || !payload.wantedBook?.author?.trim()) {
      return "Wanted book title and author are required for exchange posts";
    }
  }

  return "";
}

export const listBooks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const skip = (page - 1) * limit;
  const filter = buildBookFilter(req.query);

  const [items, total] = await Promise.all([
    BookPost.find(filter)
      .populate("owner", "name username avatar location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BookPost.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + items.length < total,
    },
  });
});

export const getBook = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Book post not found");
  }

  const book = await BookPost.findById(req.params.id).populate("owner", "name username avatar location bio");

  if (!book) {
    res.status(404);
    throw new Error("Book post not found");
  }

  res.json({
    success: true,
    data: book,
  });
});

export const createBook = asyncHandler(async (req, res) => {
  const validationError = validateBookPayload(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const book = await BookPost.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: book,
  });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await BookPost.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book post not found");
  }

  if (!book.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the post owner can update this post");
  }

  Object.assign(book, req.body);
  await book.save();

  res.json({
    success: true,
    data: book,
  });
});

export const updateBookStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["active", "sold", "exchanged", "unavailable"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const book = await BookPost.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book post not found");
  }

  if (!book.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the post owner can change status");
  }

  book.status = status;
  await book.save();

  res.json({
    success: true,
    data: book,
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await BookPost.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book post not found");
  }

  if (!book.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the post owner can delete this post");
  }

  await book.deleteOne();

  res.json({
    success: true,
    message: "Book post deleted",
  });
});
