import { Router } from "express";

import {
  cancelOrder,
  createOrder,
  getOrder,
  listAdminOrders,
  listMyOrders,
  updateAdminOrderStatus,
  updateSellerDecision,
} from "../controllers/order.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/me", protect, listMyOrders);
router.get("/admin", protect, requireAdmin, listAdminOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/seller-decision", protect, updateSellerDecision);
router.patch("/:id/cancel", protect, cancelOrder);
router.patch("/:id/admin-status", protect, requireAdmin, updateAdminOrderStatus);

export default router;
