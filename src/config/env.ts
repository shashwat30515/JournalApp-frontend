// In dev the Vite proxy forwards "/api/*" -> http://localhost:8080/* (no CORS needed).
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  // must equal app.google.redirect-uri on the backend and in Google Cloud
  googleRedirectUri: `${window.location.origin}/oauth2/callback`,
};