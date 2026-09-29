import { Router } from "express";
import {
  getSurahsController,
  getSurahByNumberController,
} from "../controllers/surah.controller";

const router = Router();

// Endpoint untuk daftar seluruh surah
router.get("/", getSurahsController);

// Endpoint untuk detail surah berdasarkan nomor
router.get("/:number", getSurahByNumberController);

export default router;