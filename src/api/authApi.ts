import { axiosInstance } from "./axiosInstance";
import { RegisterDTO, LoginDTO, UserProfile } from "../types";

export const authApi = {
  register: async (data: RegisterDTO): Promise<UserProfile> => {
    const response = await axiosInstance.post("/public/create-user", data);
    return response.data;
  },

  // Backend may return a raw token string or an object { token, user }.
  login: async (credentials: LoginDTO): Promise<{ token?: string; user?: UserProfile }> => {
    const response = await axiosInstance.post("/login", credentials);
    const data = response.data;
    if (typeof data === "string") return { token: data };
    return data;
  },
};
