"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const surah_controller_1 = require("../controllers/surah.controller");
const router = (0, express_1.Router)();
// Endpoint untuk daftar seluruh surah
router.get("/", surah_controller_1.getSurahsController);
// Endpoint untuk detail surah berdasarkan nomor
router.get("/:number", surah_controller_1.getSurahByNumberController);
exports.default = router;
