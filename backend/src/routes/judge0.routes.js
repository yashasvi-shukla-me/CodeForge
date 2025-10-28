import express from "express";
import { runCode } from "../controllers/judge0.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/run", authMiddleware, runCode);

export default router;
