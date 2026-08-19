import { Router } from "express";

import { getOfficialBook, searchOfficialBooks } from "../controllers/bookSearch.controller.js";

const router = Router();

router.get("/", searchOfficialBooks);
router.get("/:sourceId", getOfficialBook);

export default router;
