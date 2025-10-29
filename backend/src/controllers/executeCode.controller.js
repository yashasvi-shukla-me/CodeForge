import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

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
    console.log(results);

    res.status(200).json({
      message: "Code executed successfully.",
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({ message: "Server Error during code execution." });
  }
};
