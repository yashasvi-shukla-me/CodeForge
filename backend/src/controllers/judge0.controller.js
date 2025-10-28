import { createSubmission } from "../libs/judge0.lib.js";

export const runCode = async (req, res) => {
  try {
    const { sourceCode, languageId } = req.body;

    if (!sourceCode || !languageId) {
      return res.status(400).json({
        success: false,
        message: "sourceCode and languageId are required",
      });
    }

    const result = await createSubmission(sourceCode, languageId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error running code:", error.message);
    res.status(500).json({
      success: false,
      message: "Error executing code",
      error: error.message,
    });
  }
};
