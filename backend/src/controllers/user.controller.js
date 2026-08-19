import { BookPost } from "../models/BookPost.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function getUserLookup(idOrUsername) {
  if (idOrUsername.match(/^[a-f\d]{24}$/i)) {
    return { _id: idOrUsername };
  }

  return { username: idOrUsername.toLowerCase() };
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    location: user.location,
    bio: user.bio,
    authProvider: user.authProvider,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne(getUserLookup(req.params.id)).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: sanitizeUser(user),
  });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const user = await User.findOne(getUserLookup(req.params.id));

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const posts = await BookPost.find({ owner: user._id, status: "active" }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: posts,
  });
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await BookPost.find({ owner: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: posts,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "username", "avatar", "location", "bio"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({
    success: true,
    data: sanitizeUser(user),
  });
});

export const checkUsername = asyncHandler(async (req, res) => {
  const username = req.query.username?.toLowerCase();

  if (!username) {
    res.status(400);
    throw new Error("Username is required");
  }

  const exists = await User.exists({ username });

  res.json({
    success: true,
    available: !exists,
  });
});
