import express from "express";
import { registerUser, loginUser, getCurrentUser, updateProfile, deleteAccount, updateXP, getLeaderboard, getLeaderboardStream } from "../controllers/authController.js";

const router = express.Router();


export default router;