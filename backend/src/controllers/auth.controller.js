import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

function createUsernameSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

async function generateUniqueUsername(name, email) {
  const emailName = email?.split("@")[0] || "reader";
  const base = createUsernameSlug(name || emailName) || createUsernameSlug(emailName) || "reader";
  let username = base;
  let attempt = 0;

  while (await User.exists({ username })) {
    attempt += 1;
    username = `${base}-${Math.floor(10 + Math.random() * 90)}${attempt}`;
  }

  return username;
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

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const existingUser = await User.findOne({
    email: email?.toLowerCase(),
  });

  if (existingUser) {
    res.status(409);
    throw new Error("Email already exists");
  }

  const username = await generateUniqueUsername(name, email);
  const user = await User.create({
    name,
    username,
    email,
    password,
    location,
    authProvider: "local",
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Google auth will be connected after OAuth credentials are ready",
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Logged out",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});
