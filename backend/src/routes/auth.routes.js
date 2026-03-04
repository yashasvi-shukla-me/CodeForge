import express from "express";
import {
  login,
  logout,
  register,
  check,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const authRoutes = express.Router();

authRoutes.post("/register", validate({ body: registerSchema.shape.body }), register);

authRoutes.post("/login", validate({ body: loginSchema.shape.body }), login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/check", authMiddleware, check);

export default authRoutes;
