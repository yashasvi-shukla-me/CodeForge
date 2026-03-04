import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  getAllSubmissions,
  getSubmissionForProblem,
  getAllTheSubmissionsForProblem,
  submitSolution,
} from "../controllers/submission.controller.js";
import {
  submitSolutionSchema,
  getSubmissionForProblemSchema,
  getSubmissionCountSchema,
} from "../schemas/submission.schema.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  validate({ params: getSubmissionForProblemSchema.shape.params }),
  getSubmissionForProblem,
);

submissionRoutes.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  validate({ params: getSubmissionCountSchema.shape.params }),
  getAllTheSubmissionsForProblem,
);

submissionRoutes.post(
  "/submit",
  authMiddleware,
  validate({ body: submitSolutionSchema.shape.body }),
  submitSolution,
);

export default submissionRoutes;
