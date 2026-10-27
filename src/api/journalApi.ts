import { axiosInstance } from "./axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import { JournalEntry, CreateJournalDTO, UpdateJournalDTO } from "../types";

export const journalApi = {
  getAll: async (): Promise<JournalEntry[]> => {
    const response = await axiosInstance.get(ENDPOINTS.journal.base);
    return response.data;
  },

  getById: async (id: string): Promise<JournalEntry> => {
    const response = await axiosInstance.get(ENDPOINTS.journal.byId(id));
    return response.data;
  },

  create: async (data: CreateJournalDTO): Promise<JournalEntry> => {
    const response = await axiosInstance.post(ENDPOINTS.journal.base, data);
    return response.data;
  },

  update: async (id: string, data: UpdateJournalDTO): Promise<JournalEntry> => {
    const response = await axiosInstance.put(ENDPOINTS.journal.byId(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.journal.byId(id));
  },
};
