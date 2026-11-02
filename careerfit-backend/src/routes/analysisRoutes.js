
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById
} from "../controllers/analysisController.js";

const router = Router();

// All analysis endpoints require authentication.
router.use(protect);

router.post("/", createAnalysis);
router.get("/", getAnalyses);
router.get("/:id", getAnalysisById);

export default router;
