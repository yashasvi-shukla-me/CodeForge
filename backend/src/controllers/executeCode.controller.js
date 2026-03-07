import { runTestCasesSequentially } from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";
import { sendError } from "../utils/errorFormatter.js";
import { getPublicMessage } from "../utils/errorFormatter.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, problemId } = req.body;

    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    let allCases = Array.isArray(problem.testcases)
      ? problem.testcases
      : JSON.parse(problem.testcases || "[]");

    if (!allCases.length) {
      return res.status(400).json({
        success: false,
        message: "Problem has no test cases",
      });
    }

    // Normalize: ensure each test case has input and output (for user-created problems)
    allCases = allCases.map((tc) => ({
      input: tc && typeof tc.input !== "undefined" ? String(tc.input) : "",
      output: tc && typeof tc.output !== "undefined" ? String(tc.output) : "",
    }));

    const sampleCases = allCases.slice(0, 3);

    const submissions = sampleCases.map((tc) => ({
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

    if (!Array.isArray(results)) {
      throw new Error("Judge0 returned invalid results");
    }

    const testCases = results.map((r, i) => ({
      passed: (r.stdout ?? "").trim() === String(sampleCases[i].output).trim(),
      expected: sampleCases[i].output,
      stdout: (r.stdout ?? "").trim(),
    }));

    const allPassed = testCases.every((t) => t.passed);

    const formatted = {
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: results.map((r) => r.memory),
      time: results.map((r) => r.time),
      testCases,
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    sendError(res, 500, getPublicMessage(err));
  }
};
