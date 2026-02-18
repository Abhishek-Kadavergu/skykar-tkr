import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeFirebase } from "./config/firebase.js";
import geminiService from "./services/geminiService.js";
import explainRouter from "./routes/explain.js";
import userPreferenceRouter from "./routes/userPreferenceRoutes.js";
import recommendationRouter from './routes/recommendationRoutes.js';
import userRouter from './routes/userRoutes.js';
import aiRouter from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK & Firestore
initializeFirebase();

// Initialize Gemini AI
geminiService.initialize();

// Routes
app.use("/api/explain", explainRouter);
app.use("/api/user-preferences", userPreferenceRouter);
app.use("/api/recommendations", recommendationRouter);
app.use("/api/user", userRouter);
app.use("/api/ai", aiRouter);


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
