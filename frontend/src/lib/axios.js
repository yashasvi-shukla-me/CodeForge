import axios from "axios";
import { useAuthStore } from "../store/useAuthStore.js";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      useAuthStore.getState().clearAuth?.();
      // Don't redirect when 401 is from auth/check (runs on every load with no token) — avoids infinite refresh
      const isAuthCheck = err.config?.url?.includes?.("/auth/check");
      if (!isAuthCheck) {
        const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
        window.location.replace(`${base}/login`);
      }
    }
    return Promise.reject(err);
  },
);
