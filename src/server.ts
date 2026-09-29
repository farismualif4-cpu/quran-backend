import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import surahRoutes from "./routes/surah.routes";
import bookmarkRoutes from "./routes/bookmark.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/surahs", surahRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});