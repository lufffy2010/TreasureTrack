import express from "express";
import { registerUser, loginUser, getCurrentUser, updateProfile, deleteAccount, updateXP, getLeaderboard, getLeaderboardStream } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);
router.put("/profile", updateProfile);
router.delete("/profile", deleteAccount);
router.put("/xp", updateXP);
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/stream", getLeaderboardStream);

export default router;