import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  addBookmarkController,
  getBookmarksController,
  deleteBookmarkController,
} from "../controllers/bookmark.controller";

const router = Router();

// Semua endpoint bookmark diproteksi middleware autentikasi
router.post("/", authenticateToken, addBookmarkController);
router.get("/", authenticateToken, getBookmarksController);
router.delete("/:id", authenticateToken, deleteBookmarkController);

export default router;