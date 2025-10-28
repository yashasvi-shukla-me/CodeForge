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
