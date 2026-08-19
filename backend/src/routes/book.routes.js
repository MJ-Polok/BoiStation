import { Router } from "express";

import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
  updateBookStatus,
} from "../controllers/book.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", protect, createBook);
router.patch("/:id", protect, updateBook);
router.patch("/:id/status", protect, updateBookStatus);
router.delete("/:id", protect, deleteBook);

export default router;
