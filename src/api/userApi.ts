import { axiosInstance } from "./axiosInstance";
import { UserProfile, RegisterDTO } from "../types";

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get("/user");
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.put("/user", data);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosInstance.delete("/user");
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await axiosInstance.get("/admin/all-users-get");
    return response.data;
  },

  createAdminUser: async (data: RegisterDTO): Promise<UserProfile> => {
    const response = await axiosInstance.post("/admin/create-admin-user", data);
    return response.data;
  },
};
