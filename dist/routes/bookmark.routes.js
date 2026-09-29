"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const bookmark_controller_1 = require("../controllers/bookmark.controller");
const router = (0, express_1.Router)();
// Semua endpoint bookmark diproteksi middleware autentikasi
router.post("/", auth_middleware_1.authenticateToken, bookmark_controller_1.addBookmarkController);
router.get("/", auth_middleware_1.authenticateToken, bookmark_controller_1.getBookmarksController);
router.delete("/:id", auth_middleware_1.authenticateToken, bookmark_controller_1.deleteBookmarkController);
exports.default = router;
