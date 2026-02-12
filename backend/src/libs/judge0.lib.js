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
      },
    );

    return response.data;
  } catch (err) {
    console.error("Judge0 API Error:", err.response?.data || err.message);
    throw err;
  }
};

// export const submitBatch = async (submissions) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/submissions/batch?base64_encoded=false`,
//       { submissions },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-RapidAPI-Key": API_KEY,
//           "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//         },
//       },
//     );

//     const tokens = response.data.map((item) => item.token);

//     const results = await pollBatchResults(tokens);

//     return results;
//   } catch (err) {
//     console.error("Judge0 Batch API Error:", err.response?.data || err.message);
//     throw err;
//   }
// };

export const runTestCasesSequentially = async (submissions) => {
  const results = [];

  for (const sub of submissions) {
    const response = await axios.post(
      `${API_URL}/submissions?base64_encoded=false&wait=true`,
      sub,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      },
    );

    results.push(response.data);
  }

  return results;
};

export const pollBatchResults = async (
  tokens,
  interval = 1500,
  maxAttempts = 10,
) => {
  const results = [];

  for (const token of tokens) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, interval));

      const response = await axios.get(
        `${API_URL}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        },
      );

      const submission = response.data;

      if (submission.status && submission.status.id >= 3) {
        results.push(submission);
        break;
      }

      attempts++;
    }
  }

  return results;
};

export const getLanguageName = (LanguageId) => {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python 3",
    62: "Java",
  };

  return LANGUAGE_NAMES[LanguageId] || "Unknown";
};
