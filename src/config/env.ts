// In dev the Vite proxy forwards "/api/*" -> http://localhost:8080/* (no CORS needed).
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
};
