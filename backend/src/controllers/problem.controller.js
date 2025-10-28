import { createSubmission } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !tags ||
      !examples ||
      !testcases
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id, // from authMiddleware
      },
    });

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: newProblem,
    });
  } catch (err) {
    console.error("Error creating problem:", err);
    res.status(500).json({
      success: false,
      message: "Error creating problem",
      error: err.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await prisma.problem.findMany();

    if (problems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No problems found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Problems retrieved successfully",
      data: problems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching problems",
      error: error.message,
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id: String(id) },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Problem retrieved successfully",
      data: problem,
    });
  } catch (error) {
    console.log("ID from params:", req.params.id);

    console.error("Error fetching problem:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching problem",
      error: error.message,
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    // Check if problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Update fields (only provided ones)
    const updatedProblem = await prisma.problem.update({
      where: { id },
      data: {
        title: title ?? existingProblem.title,
        description: description ?? existingProblem.description,
        difficulty: difficulty ?? existingProblem.difficulty,
        tags: tags ?? existingProblem.tags,
        examples: examples ?? existingProblem.examples,
        constraints: constraints ?? existingProblem.constraints,
        hints: hints ?? existingProblem.hints,
        editorial: editorial ?? existingProblem.editorial,
        testcases: testcases ?? existingProblem.testcases,
        codeSnippets: codeSnippets ?? existingProblem.codeSnippets,
        referenceSolutions:
          referenceSolutions ?? existingProblem.referenceSolutions,
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem,
    });
  } catch (err) {
    console.error("Error updating problem:", err);
    res.status(500).json({
      success: false,
      message: "Error updating problem",
      error: err.message,
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: String(id) },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }
    await prisma.problem.delete({
      where: { id: String(id) },
    });

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting problem",
      error: error.message,
    });
  }
};

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
