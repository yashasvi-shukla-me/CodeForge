import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

function getErrorMessage(error) {
  const msg = error?.response?.data?.message ?? error?.response?.data?.error;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.join(" ");
  return null;
}

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  clearAuth: () => set({ authUser: null }),

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
    } catch (error) {
      toast.error(getErrorMessage(error) || "Error signing up");
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
    } catch (error) {
      toast.error(getErrorMessage(error) || "Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Proceed to clear local state even if server call fails
    } finally {
      localStorage.removeItem("token");
      set({ authUser: null });
      toast.success("Logout successful");
    }
  },
}));
