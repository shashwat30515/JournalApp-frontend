import axios from "axios";
import { env } from "../config/env";
import { ENDPOINTS } from "../config/endpoints";
import { toast } from "sonner";
import { isTokenExpired } from "../utils/jwt";

export const TOKEN_KEY = "journal_auth_token";
export const LOGIN_METHOD_KEY = "login_method";
export const setLoginMethod = (m: "google" | "password") =>
  localStorage.setItem(LOGIN_METHOD_KEY, m);
export const getLoginMethod = (): "google" | "password" =>
  localStorage.getItem(LOGIN_METHOD_KEY) === "google" ? "google" : "password";

// ignores an old "Basic ..." value left over from the previous login method
export const getToken = (): string | null => {
  const t = localStorage.getItem(TOKEN_KEY);
  return t && !t.startsWith("Basic ") ? t : null;
};
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGIN_METHOD_KEY);
};

// clears the session and goes to /login; the login page shows the reason
export const forceLogout = (message = "Session expired. Please log in again.") => {
  clearToken();
  sessionStorage.setItem("logout_reason", message);
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic =
  config.url === ENDPOINTS.auth.login ||
  config.url === ENDPOINTS.auth.register ||
  config.url === ENDPOINTS.auth.googleCallback;

    const token = getToken();
    if (token && !isPublic) {
      if (isTokenExpired(token)) {
        forceLogout("Your session has expired. Please log in again.");
        return Promise.reject(new axios.CanceledError("Session expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

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
        } else {
          forceLogout("Session expired or unauthorized. Please log in again.");
        }
        break;
      case 403: {
        const token = getToken();
        if (token && isTokenExpired(token)) {
          forceLogout("Your session has expired. Please log in again.");
        } else {
          toast.error("Access Denied: You do not have permission for this action.");
        }
        break;
      }
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