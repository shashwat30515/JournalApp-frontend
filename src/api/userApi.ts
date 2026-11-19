import { axiosInstance, getToken } from "./axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import { UserProfile } from "../types";
import { decodeJwt } from "../utils/jwt";

// True if any role value mentions ADMIN
const roleLooksLikeAdmin = (raw: any): boolean => {
  const values: any[] = [
    raw?.role,
    ...(Array.isArray(raw?.roles) ? raw.roles : []),
    ...(Array.isArray(raw?.authorities)
      ? raw.authorities.map((a: any) => (typeof a === "string" ? a : a?.authority))
      : []),
  ];
  return values.some((v) => typeof v === "string" && v.toUpperCase().includes("ADMIN"));
};

// Reads the flag whatever the backend calls it
const readFlag = (obj: any): boolean | undefined => {
  const v = obj?.sentimentAnalysis ?? obj?.sentimentanalysis ?? obj?.sentiment_analysis;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return undefined;
};

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get(ENDPOINTS.user.me);
    const raw = response.data;
    const obj = Array.isArray(raw) ? raw[0] : raw;

    const token = getToken();
    const payload = token ? decodeJwt(token) : null;

    let isAdmin = roleLooksLikeAdmin(obj) || roleLooksLikeAdmin(payload);
    if (!isAdmin) {
      try {
        const adminCheck = await axiosInstance.get(ENDPOINTS.admin.allUsers, {
          validateStatus: () => true,
        });
        isAdmin = adminCheck.status >= 200 && adminCheck.status < 300;
      } catch {
        // keep isAdmin as is
      }
    }

    return {
      ...(typeof obj === "object" && obj ? obj : {}),
      username:
        obj?.username ?? obj?.userName ?? obj?.name ?? obj?.user ?? payload?.sub ?? "",
      email: obj?.email ?? obj?.mail ?? "",
      sentimentAnalysis: readFlag(obj),
      role: isAdmin ? "ADMIN" : "USER",
    } as UserProfile;
  },

  updateProfile: async (data: {
    username: string;
    password?: string;
    email?: string;
  }): Promise<UserProfile> => {
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

  createAdminUser: async (data: {
    username: string;
    password: string;
    email?: string;
  }): Promise<UserProfile> => {
    const response = await axiosInstance.post(ENDPOINTS.admin.createAdmin, data);
    return response.data;
  },

  adminMakeAdmin: async (id: string): Promise<void> => {
    await axiosInstance.put(ENDPOINTS.admin.makeAdmin(id));
  },

  adminRemoveAdmin: async (id: string): Promise<void> => {
    await axiosInstance.put(ENDPOINTS.admin.removeAdmin(id));
  },

  adminDeleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.admin.deleteUser(id));
  },

  adminGetAllJournals: async (): Promise<any[]> => {
    const response = await axiosInstance.get(ENDPOINTS.admin.allJournals);
    return response.data ?? [];
  },
};