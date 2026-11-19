import { axiosInstance } from "./axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import { RegisterDTO, LoginDTO, UserProfile } from "../types";

// Accepts "eyJ...", "Bearer eyJ...", { token }, { jwt } or { accessToken }
const extractToken = (data: any): string => {
  const raw =
    typeof data === "string"
      ? data
      : data?.token ?? data?.jwt ?? data?.accessToken ?? data?.access_token ?? "";
  return String(raw).replace(/^Bearer\s+/i, "").trim();
};

export const authApi = {
  register: async (data: RegisterDTO): Promise<UserProfile> => {
    const response = await axiosInstance.post(ENDPOINTS.auth.register, data);
    return response.data;
  },

  login: async (credentials: LoginDTO): Promise<{ token: string }> => {
    const response = await axiosInstance.post(ENDPOINTS.auth.login, credentials);
    const token = extractToken(response.data);
    if (!token) throw new Error("Login succeeded but the server returned no token.");
    return { token };
  },
    googleLogin: async (code: string): Promise<{ token: string }> => {
    const response = await axiosInstance.get(ENDPOINTS.auth.googleCallback, {
      params: { code },
    });
    const token = extractToken(response.data);
    if (!token) throw new Error("Google sign-in returned no token.");
    return { token };
  },

  // Checks a username and password without any toast or redirect.
  // Returns a fresh token if they are correct, otherwise null.
  checkCredentials: async (username: string, password: string): Promise<string | null> => {
    const res = await axiosInstance.post(
      ENDPOINTS.auth.login,
      { username, password },
      { validateStatus: () => true }
    );
    if (res.status >= 200 && res.status < 300) {
      return extractToken(res.data) || null;
    }
    return null;
  },
};