"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || "quranhub_secret_key_123";
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
async function registerController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Format email tidak valid." });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password minimal 6 karakter." });
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email sudah terdaftar." });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { email, password: hashedPassword },
        });
        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil.",
            data: { id: user.id, email: user.email },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server saat registrasi." });
    }
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: "Email atau password salah." });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Email atau password salah." });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({
            success: true,
            message: "Login berhasil.",
            token,
            user: { id: user.id, email: user.email },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server saat login." });
    }
}
