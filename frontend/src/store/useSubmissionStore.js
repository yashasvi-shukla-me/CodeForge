import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

function getErrorMessage(error) {
  const msg = error?.response?.data?.message ?? error?.response?.data?.error;
  if (typeof msg === "string") return msg;
  return null;
}

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submissionCount: null,

  /* ---------------- FETCH LIST ---------------- */
  getSubmissionForProblem: async (problemId) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`,
      );

      set({ submissions: res.data.submissions || [] });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  /* ---------------- COUNT ---------------- */
  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission-count/${problemId}`,
      );
      set({ submissionCount: res.data.count });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to load submission count");
    }
  },

  /* ---------------- SUBMIT ---------------- */
  submitSolution: async (payload) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/submission/submit", payload);

      // ⭐ IMPORTANT: auto refresh list
      await get().getSubmissionForProblem(payload.problemId);

      toast.success("Submitted successfully");

      return res.data;
    } catch (error) {
      toast.error(getErrorMessage(error) || "Submission failed");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
