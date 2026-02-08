import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

  // Run code ONLY (no submission save)
  executeCode: async ({
    source_code,
    language_id,
    stdin = "",
    expected_outputs = [],
    problemId = null,
  }) => {
    try {
      set({ isExecuting: true });

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      // backend usually returns res.data.data or res.data.submission
      set({ submission: res.data.data || res.data.submission });

      toast.success("Execution completed");
    } catch (error) {
      console.error("Error executing code", error);
      toast.error("Execution failed");
      throw error;
    } finally {
      set({ isExecuting: false });
    }
  },

  clearExecution: () => set({ submission: null }),
}));
