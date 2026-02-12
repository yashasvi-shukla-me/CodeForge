import { db } from "../libs/db.js";
// import { submitBatch } from "../libs/judge0.lib.js";
import { getLanguageName } from "../libs/judge0.lib.js";
import { runTestCasesSequentially } from "../libs/judge0.lib.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: {
        userId,
        problemId, // include only if needed
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const submissions = await db.submission.findMany({
      where: {
        userId,
        problemId, // include only if needed
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions for the problem fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions for problem:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);
    console.log("USER:", req.user);
    const { problemId } = req.params;

    if (!problemId) {
      return res
        .status(400)
        .json({ success: false, message: "Problem ID required" });
    }

    const count = await db.submission.count({
      where: { problemId: String(problemId) },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      count,
    });
  } catch (error) {
    console.error("Fetch Submissions Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId, source_code, language_id } = req.body;

    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({ success: false });
    }

    const allCases = Array.isArray(problem.testcases)
      ? problem.testcases
      : JSON.parse(problem.testcases || "[]");

    const submissions = allCases.map((tc) => ({
      source_code,
      language_id,
      stdin: String(tc.input).trim() + "\n",
    }));

    const results = await runTestCasesSequentially(submissions);

    if (!results.length) {
      return res.status(500).json({
        success: false,
        message: "Judge0 did not return execution results",
      });
    }

    const testCases = results.map((r, i) => ({
      passed: (r.stdout ?? "").trim() === String(allCases[i].output).trim(),
      expected: allCases[i].output,
      stdout: (r.stdout ?? "").trim(),
    }));

    const allPassed = testCases.every((t) => t.passed);

    const avgMemory = results.length
      ? results.reduce((a, r) => a + (parseFloat(r.memory) || 0), 0) /
        results.length
      : 0;

    const avgTime = results.length
      ? results.reduce((a, r) => a + (parseFloat(r.time) || 0), 0) /
        results.length
      : 0;

    const record = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),

        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: String(avgMemory),
        time: String(avgTime),
      },
    });

    console.log("Saved:", record.id);

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
