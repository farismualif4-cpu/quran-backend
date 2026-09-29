"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "quranhub_secret_key_123";
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Mengambil Bearer token
    // 1. Cek apakah token ada
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Akses ditolak. Token tidak ditemukan.",
        });
    }
    // 2. Verifikasi JWT token
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token sudah kedaluwarsa, silakan login kembali.",
                });
            }
            return res.status(403).json({
                success: false,
                message: "Token tidak valid.",
            });
        }
        // 3. Tambahkan user context ke request object
        req.user = decoded;
        next();
    });
}
