import { db } from "../libs/db.js";
import {
  submitBatch,
  pollBatchResults,
  getJudge0LanguageId,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  // going to get all the data from req.body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // going to check user role once again

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }

        // save the problem to the database
        const newProblem = await db.problem.create({
          data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            codeSnippets,
            referenceSolutions,
            userId: req.user.id,
          },
        });

        return res.status(201).json(newProblem);
      }
    }
  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // loop through each reference solution for different languages
};

export const getAllProblems = (req, res) => {};

export const getProblemById = (req, res) => {};

export const updateProblem = (req, res) => {};

export const deleteProblem = (req, res) => {};

export const getAllProblemsSolvedByUser = (req, res) => {};
