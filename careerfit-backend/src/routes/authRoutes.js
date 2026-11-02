import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe, updateProfile } from "../controllers/authController.js";
import { removeAvatar, updateAvatar } from "../controllers/avatarController.js";
import avatarUpload from "../middleware/avatarUploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/avatar", protect, avatarUpload.single("avatar"), updateAvatar);
router.delete("/me/avatar", protect, removeAvatar);
router.post("/logout", protect, logoutUser);

export default router;
