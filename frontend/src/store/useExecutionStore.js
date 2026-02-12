import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

  executeCode: async (payload) => {
    try {
      set({ isExecuting: true, submission: null });

      // ⭐ SEND FULL PAYLOAD AS-IS
      const res = await axiosInstance.post("/execute-code", payload);

      set({ submission: res.data.data });
    } catch (error) {
      console.log(error);
      toast.error("Execution failed");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
