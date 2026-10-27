import axios from "axios";
import { env } from "../config/env";
import { toast } from "sonner";
import { ENDPOINTS } from "../config/endpoints";

export const TOKEN_KEY = "journal_auth_token";

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const isLoginCall = error.config?.url === ENDPOINTS.auth.login;

    if (!error.response) {
      toast.error("Network Error: Unable to connect to the backend server.");
      return Promise.reject(error);
    }

    switch (status) {
      case 401:
        if (isLoginCall) {
          toast.error("Invalid username or password.");
          break;
        }
        localStorage.removeItem(TOKEN_KEY);
        toast.error("Session expired or unauthorized. Please log in again.");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;
      case 403:
        toast.error("Access Denied: You do not have permission for this action.");
        break;
      case 404:
        toast.error("Requested resource not found.");
        break;
      case 400:
        toast.error(message || "Invalid request. Please check your inputs.");
        break;
      case 500:
        toast.error("Internal server error. Please try again later.");
        break;
      default:
        toast.error(message || "An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);
