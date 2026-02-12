import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

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
      console.log(error);
      toast.error("Failed to fetch submissions");
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
      console.log(error);
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
      console.log("Submit error:", error.response?.data);
      toast.error("Submission failed");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
