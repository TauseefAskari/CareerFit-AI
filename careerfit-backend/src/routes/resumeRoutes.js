import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadResume } from "../controllers/resumeController.js";

const router = Router();

// Accepts exactly one file in the "resume" form-data field.
router.post("/upload", protect, upload.single("resume"), uploadResume);

export default router;
