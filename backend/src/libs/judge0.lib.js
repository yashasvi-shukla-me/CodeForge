import axios from "axios";

const API_URL = process.env.JUDGE0_API_URL;
const API_KEY = process.env.JUDGE0_API_KEY;

export const createSubmission = async (sourceCode, languageId) => {
  try {
    const response = await axios.post(
      `${API_URL}/submissions/?base64_encoded=false&wait=true`,
      {
        source_code: sourceCode,
        language_id: languageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Judge0 API Error:", err.response?.data || err.message);
    throw err;
  }
};

export const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      `${API_URL}/submissions/batch?base64_encoded=false&wait=true`,
      { submissions },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Judge0 Batch API Error:", err.response?.data || err.message);
    throw err;
  }
};

export const pollBatchResults = async (
  tokens,
  interval = 2000,
  maxAttempts = 15
) => {
  const results = {};
  const pendingTokens = new Set(tokens);
  let attempts = 0;

  while (pendingTokens.size > 0 && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response = await axios.get(
      `${API_URL}/submissions/batch?base64_encoded=false&tokens=${Array.from(
        pendingTokens
      ).join(",")}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    response.data.submissions.forEach((submission) => {
      if (submission.status?.id >= 3) {
        results[submission.token] = submission;
        pendingTokens.delete(submission.token);
      }
    });

    attempts++;
  }

  return results;
};
