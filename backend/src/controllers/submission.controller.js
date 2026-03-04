import { db } from "../libs/db.js";
import { getLanguageName } from "../libs/judge0.lib.js";
import { runTestCasesSequentially } from "../libs/judge0.lib.js";
import { sendError } from "../utils/errorFormatter.js";
import { getPublicMessage } from "../utils/errorFormatter.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    return sendError(res, 500, getPublicMessage(error));
  }
};

export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const submissions = await db.submission.findMany({
      where: { userId, problemId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Submissions for the problem fetched successfully",
      submissions,
    });
  } catch (error) {
    return sendError(res, 500, getPublicMessage(error));
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
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
    return sendError(res, 500, getPublicMessage(error));
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
      stderr: r.stderr ?? null,
      status: r.status?.description ?? String(r.status?.id ?? "Unknown"),
      memory: r.memory != null ? String(r.memory) : null,
      time: r.time != null ? String(r.time) : null,
      compileOutput: r.compile_output ?? null,
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
        testCases: {
          create: testCases.map((tc, i) => ({
            testCase: i + 1,
            passed: tc.passed,
            expected: tc.expected,
            stdout: tc.stdout ?? null,
            stderr: tc.stderr ?? null,
            status: tc.status,
            memory: tc.memory,
            time: tc.time,
            compileOutput: tc.compileOutput,
          })),
        },
      },
    });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: { userId, problemId },
        },
        create: { userId, problemId },
        update: {},
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    return sendError(res, 500, getPublicMessage(err));
  }
};
