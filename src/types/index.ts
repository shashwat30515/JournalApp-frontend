export type Role = "USER" | "ADMIN";
export type Sentiment = "Happy" | "Sad" | "Angry" | "Anxious";

export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  role: Role;
  sentimentAnalysis?: boolean;
  createdAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  sentiment?: Sentiment;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJournalDTO {
  title: string;
  content: string;
  sentiment?: Sentiment;
}

export interface UpdateJournalDTO {
  title: string;
  content: string;
  sentiment?: Sentiment;
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