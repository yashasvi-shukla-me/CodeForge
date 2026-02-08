import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
  runProblemCode, // 👈 import this new controller
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

// --------------------- Admin Routes ---------------------
problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem,
);

problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem,
);

problemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem,
);

// --------------------- User Routes ---------------------
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser,
);

// --------------------- Judge0 Execution ---------------------
// anyone logged in can run code
problemRoutes.post("/execute-code", authMiddleware, runProblemCode);

export default problemRoutes;
