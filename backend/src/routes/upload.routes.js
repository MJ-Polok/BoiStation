import { Router } from "express";
import multer from "multer";

import { uploadImages } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,
    files: 5,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

router.post("/images", protect, upload.array("images", 5), uploadImages);

export default router;
