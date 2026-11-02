import express from "express";
import analysisRoutes from "./routes/analysisRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js"
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Apply shared security, request parsing, and rate-limit middleware before routes.
app.use(helmet());
app.use(cors({
  // Allow the configured client (or the local dev client) to send cookies.
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(generalLimiter);

// Lightweight status response; this endpoint does not check database connectivity.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "CareerFit API",
    database: "connected"
  });
});

// Keep API routes versioned so future breaking changes can use a new prefix.
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resumes", resumeRoutes);
app.use("/api/v1/analysis", analysisRoutes);

// These handlers must follow the routes to catch unmatched paths and route errors.
app.use(notFound);
app.use(errorHandler);

export default app;
