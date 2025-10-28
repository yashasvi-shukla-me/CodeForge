import { createSubmission } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {};

export const getAllProblems = (req, res) => {};

export const getProblemById = (req, res) => {};

export const updateProblem = (req, res) => {};

export const deleteProblem = (req, res) => {};

export const getAllProblemsSolvedByUser = (req, res) => {};

export const runProblemCode = async (req, res) => {
  try {
    const { source_code, language_id } = req.body;

    if (!source_code || !language_id) {
      return res.status(400).json({
        success: false,
        message: "source_code and language_id are required",
      });
    }

    const result = await createSubmission(source_code, language_id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Run Problem Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
