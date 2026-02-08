import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
    } catch {
      set({ authUser: null });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });

    try {
      const res = await axiosInstance.post("/auth/register", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch {
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch {
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    set({ authUser: null });
    toast.success("Logout successful");
  },
}));
