import { axiosInstance } from "./axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import { JournalEntry, CreateJournalDTO, UpdateJournalDTO } from "../types";

const hex = (n: number, len: number) => (n >>> 0).toString(16).padStart(len, "0").slice(-len);

// Converts any ObjectId shape to a 24-character string
const toIdString = (raw: any): string => {
  if (raw == null) return "";
  if (typeof raw === "string") return raw;

  // { $oid: "..." }
  if (typeof raw.$oid === "string") return raw.$oid;
  if (typeof raw.hexString === "string") return raw.hexString;

  // Older Mongo driver: { timestamp, machineIdentifier, processIdentifier, counter }
  if (
    typeof raw.timestamp === "number" &&
    typeof raw.machineIdentifier === "number" &&
    typeof raw.processIdentifier === "number" &&
    typeof raw.counter === "number"
  ) {
    return (
      hex(raw.timestamp, 8) +
      hex(raw.machineIdentifier, 6) +
      hex(raw.processIdentifier, 4) +
      hex(raw.counter, 6)
    );
  }
  return "";
};

const normalize = (raw: any): JournalEntry => {
  const id = toIdString(raw?.id ?? raw?._id);
  if (!id) console.warn("Journal entry has no usable id:", raw);
  return { ...raw, id };
};

export const journalApi = {
  getAll: async (): Promise<JournalEntry[]> => {
    const response = await axiosInstance.get(ENDPOINTS.journal.base);
    return (response.data ?? []).map(normalize);
  },

  getById: async (id: string): Promise<JournalEntry> => {
    const response = await axiosInstance.get(ENDPOINTS.journal.byId(id));
    return normalize(response.data);
  },

  create: async (data: CreateJournalDTO): Promise<JournalEntry> => {
    const response = await axiosInstance.post(ENDPOINTS.journal.base, data);
    return normalize(response.data);
  },

  update: async (id: string, data: UpdateJournalDTO): Promise<JournalEntry> => {
    const response = await axiosInstance.put(ENDPOINTS.journal.byId(id), data);
    return normalize(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.journal.byId(id));
  },
};