import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

function getErrorMessage(error) {
  const msg = error?.response?.data?.message ?? error?.response?.data?.error;
  if (typeof msg === "string") return msg;
  return null;
}

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");

      set({ problems: res.data.data });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch problems.");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.data });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch problem.");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");

      set({ solvedProblems: res.data.data ?? res.data.problems ?? [] });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch solved problems.");
    }
  },
}));
