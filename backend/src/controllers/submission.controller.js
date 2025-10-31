export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
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
        userId: userId,
        problemId: problemId,
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
    const problemId = req.params.problemId;

    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submisisons Fetched Successfully",
      count: submission,
    });
  } catch (error) {
    console.error("Fetch Submissions Error", error);
    res.status(500).json({
      error: "Fialed to fetch submissions",
    });
  }
};
