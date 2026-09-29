import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../utils/prisma";

// POST /api/bookmarks
export async function addBookmarkController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { surahNo, ayatNo } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!surahNo || !ayatNo) {
      return res.status(400).json({
        success: false,
        message: "surahNo dan ayatNo wajib diisi.",
      });
    }

    // Simpan bookmark (atau tangani jika sudah ada)
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        surahNo: Number(surahNo),
        ayatNo: Number(ayatNo),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Bookmark berhasil ditambahkan.",
      data: bookmark,
    });
  } catch (error: any) {
    // Handling error unique constraint Prisma
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Ayat ini sudah ada di daftar bookmark Anda.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menambahkan bookmark.",
    });
  }
}

// GET /api/bookmarks
export async function getBookmarksController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil bookmark.",
    });
  }
}

// DELETE /api/bookmarks/:id
export async function deleteBookmarkController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Express 5: req.params.id bertipe string | string[], jadi validasi dulu
    if (typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "ID bookmark tidak valid.",
      });
    }

    // Pastikan bookmark tersebut milik user yang sedang login
    const bookmark = await prisma.bookmark.findFirst({
      where: { id, userId },
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark tidak ditemukan.",
      });
    }

    await prisma.bookmark.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Bookmark berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menghapus bookmark.",
    });
  }
}
