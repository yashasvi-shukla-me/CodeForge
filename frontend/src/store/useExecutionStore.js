import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function getErrorMessage(error) {
  const msg = error?.response?.data?.message ?? error?.response?.data?.error;
  if (typeof msg === "string") return msg;
  return null;
}

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

  executeCode: async (payload) => {
    try {
      set({ isExecuting: true, submission: null });

      const res = await axiosInstance.post("/execute-code", payload);

      set({ submission: res.data.data });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Execution failed");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
