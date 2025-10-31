import {
  pollBatchResults,
  submitBatch,
  getLanguageName,
} from "../libs/judge0.lib.js";
import { PrismaClient } from "../generated/prisma/index.js";

const db = new PrismaClient();

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // validate test cases

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ message: "Invalid test cases." });
    }

    // prepare each test case for Judge0 API

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send this batch to Judge0 API

    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // Polling results from Judge0 API

    const results = await pollBatchResults(tokens);

    console.log("Final Results:", results);

    // analyze results

    let allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i].trim();

      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} sec` : undefined,
      };

      // console.log(`Test Case ${i + 1}`);
      // console.log("Input:", stdin[i]);
      // console.log("Expected Output:", expected_output);
      // console.log("Actual Output:", stdout);
      // console.log("Passed:", passed);
      // console.log("-----------------------");
    });

    console.log(detailedResults);

    // Here, you can save the detailedResults and allPassed status to your database
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // if all test cases passed
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const SubmissionWithTestCases = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code executed successfully.",
      submission: SubmissionWithTestCases,
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({ message: "Server Error during code execution." });
  }
};
