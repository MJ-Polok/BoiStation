import { Router } from "express";

import {
  checkUsername,
  getMyPosts,
  getUserPosts,
  getUserProfile,
  updateMe,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/check-username", checkUsername);
router.get("/me/posts", protect, getMyPosts);
router.patch("/me", protect, updateMe);
router.get("/:id", getUserProfile);
router.get("/:id/posts", getUserPosts);

export default router;
