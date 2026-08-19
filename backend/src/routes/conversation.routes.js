import { Router } from "express";

import {
  createOrGetConversation,
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage,
} from "../controllers/conversation.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, listConversations);
router.post("/", protect, createOrGetConversation);
router.get("/:id/messages", protect, listMessages);
router.post("/:id/messages", protect, sendMessage);
router.patch("/:id/read", protect, markConversationRead);

export default router;
