export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
};

if (!env.apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is missing in environment configuration.");
}
