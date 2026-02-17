import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import explainRouter from "./routes/explain.js";
import userPreferenceRouter from "./routes/userPreferenceRoutes.js";
import recommendationRouter from './routes/recommendationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/aalayax")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/explain", explainRouter);
app.use("/api/user-preferences", userPreferenceRouter);
app.use("/api/recommendations", recommendationRouter);


// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AalayaX API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
