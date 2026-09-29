"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurahsController = getSurahsController;
exports.getSurahByNumberController = getSurahByNumberController;
const quran_service_1 = require("../services/quran.service");
// Controller untuk mengambil semua daftar surah
async function getSurahsController(req, res) {
    try {
        const data = await (0, quran_service_1.getSurahs)();
        return res.status(200).json({ success: true, data });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal mengambil daftar surah dari server.",
        });
    }
}
// Controller untuk mengambil detail ayat lengkap per surah
async function getSurahByNumberController(req, res) {
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
        const data = await (0, quran_service_1.getSurahByNumber)(surahNo);
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal mengambil data ayat dari server.",
        });
    }
}
