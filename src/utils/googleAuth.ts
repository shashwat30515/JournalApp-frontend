import { env } from "../config/env";

const STATE_KEY = "google_oauth_state";

export const startGoogleLogin = () => {
  if (!env.googleClientId) {
    alert("VITE_GOOGLE_CLIENT_ID is missing in .env");
    return;
  }
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: env.googleRedirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state,
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const consumeGoogleState = (): string | null => {
  const s = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return s;
};