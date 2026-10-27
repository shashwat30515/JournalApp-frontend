import { axiosInstance } from "./axiosInstance";
import { JournalEntry, CreateJournalDTO, UpdateJournalDTO } from "../types";

export const journalApi = {
  getAll: async (): Promise<JournalEntry[]> => {
    const response = await axiosInstance.get("/journal");
    return response.data;
  },

  getById: async (id: string): Promise<JournalEntry> => {
    const response = await axiosInstance.get(`/journal/id/${id}`);
    return response.data;
  },

  create: async (data: CreateJournalDTO): Promise<JournalEntry> => {
    const response = await axiosInstance.post("/journal", data);
    return response.data;
  },

  update: async (id: string, data: UpdateJournalDTO): Promise<JournalEntry> => {
    const response = await axiosInstance.put(`/journal/id/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/journal/id/${id}`);
  },
};
