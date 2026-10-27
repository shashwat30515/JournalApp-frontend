export type Role = "USER" | "ADMIN";

export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJournalDTO {
  title: string;
  content: string;
}

export interface UpdateJournalDTO {
  title: string;
  content: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}
