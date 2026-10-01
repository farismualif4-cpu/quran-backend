import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import surahRoutes from "./routes/surah.routes";
import bookmarkRoutes from "./routes/bookmark.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "QuranHub API berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/surahs", surahRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

export default app;
