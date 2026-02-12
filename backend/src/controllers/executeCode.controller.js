import { createSubmission } from "../libs/judge0.lib.js";

// import { submitBatch } from "../libs/judge0.lib.js";
import { runTestCasesSequentially } from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";

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

    const allCases = Array.isArray(problem.testcases)
      ? problem.testcases
      : JSON.parse(problem.testcases || "[]");

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
    res.status(500).json({ success: false, message: err.message });
  }
};
