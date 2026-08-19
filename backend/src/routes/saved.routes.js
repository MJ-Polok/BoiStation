import { Router } from "express";

import { listSavedBooks, removeSavedBook, saveBook } from "../controllers/saved.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, listSavedBooks);
router.post("/:bookId", protect, saveBook);
router.delete("/:bookId", protect, removeSavedBook);

export default router;
