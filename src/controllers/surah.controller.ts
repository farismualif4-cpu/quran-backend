import { Request, Response } from "express";
import { getSurahs, getSurahByNumber } from "../services/quran.service";

// Controller untuk mengambil semua daftar surah
export async function getSurahsController(req: Request, res: Response) {
  try {
    const data = await getSurahs();
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal mengambil daftar surah dari server.",
    });
  }
}

// Controller untuk mengambil detail ayat lengkap per surah
export async function getSurahByNumberController(req: Request, res: Response) {
  try {
    const { number } = req.params;

    // Express 5: req.params bisa bertipe string | string[]
    if (typeof number !== "string") {
      return res.status(400).json({
        success: false,
        message: "Nomor surah tidak valid.",
      });
    }

    const surahNo = parseInt(number, 10);

    // Validasi nomor surah (1 - 114)
    if (isNaN(surahNo) || surahNo < 1 || surahNo > 114) {
      return res.status(400).json({
        success: false,
        message: "Nomor surah tidak valid. Masukkan angka antara 1 sampai 114.",
      });
    }

    // Mengambil data detail surah beserta ayat lengkap
    const data = await getSurahByNumber(surahNo);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal mengambil data ayat dari server.",
    });
  }
}
