import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "quranhub_secret_key_123";

// Extend interface Request Express agar bisa menyimpan data user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
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
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
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
    req.user = decoded as { userId: string; email: string };
    next();
  });
}
