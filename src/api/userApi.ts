import { axiosInstance } from "./axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import { UserProfile, RegisterDTO } from "../types";

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get(ENDPOINTS.user.me);
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.put(ENDPOINTS.user.me, data);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.user.me);
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await axiosInstance.get(ENDPOINTS.admin.allUsers);
    return response.data;
  },

  createAdminUser: async (data: RegisterDTO): Promise<UserProfile> => {
    const response = await axiosInstance.post(ENDPOINTS.admin.createAdmin, data);
    return response.data;
  },
};
