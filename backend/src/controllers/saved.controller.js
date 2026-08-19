import mongoose from "mongoose";
import { BookPost } from "../models/BookPost.js";
import { SavedBook } from "../models/SavedBook.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listSavedBooks = asyncHandler(async (req, res) => {
  const saved = await SavedBook.find({ user: req.user._id })
    .populate({
      path: "bookPost",
      populate: {
        path: "owner",
        select: "name username avatar location",
      },
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: saved,
  });
});

export const saveBook = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.bookId)) {
    res.status(400);
    throw new Error("Invalid book post id");
  }

  const bookExists = await BookPost.exists({ _id: req.params.bookId, status: "active" });

  if (!bookExists) {
    res.status(404);
    throw new Error("Book post not found");
  }

  const saved = await SavedBook.findOneAndUpdate(
    { user: req.user._id, bookPost: req.params.bookId },
    { user: req.user._id, bookPost: req.params.bookId },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).populate("bookPost");

  res.status(201).json({
    success: true,
    data: saved,
  });
});

export const removeSavedBook = asyncHandler(async (req, res) => {
  await SavedBook.deleteOne({ user: req.user._id, bookPost: req.params.bookId });

  res.json({
    success: true,
    message: "Removed from saved books",
  });
});
