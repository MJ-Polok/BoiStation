import { Router } from "express";

import { getMe, googleAuth, login, logout, signup } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
