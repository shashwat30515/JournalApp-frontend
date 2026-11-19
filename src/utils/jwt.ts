// Reads the payload of a JWT (no signature check; the backend does that)
export const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

// Expiry time in milliseconds, or null if the token has no "exp" claim
export const getTokenExpiryMs = (token: string): number | null => {
  const payload = decodeJwt(token);
  return payload?.exp ? Number(payload.exp) * 1000 : null;
};

export const isTokenExpired = (token: string, skewSeconds = 10): boolean => {
  const exp = getTokenExpiryMs(token);
  if (exp === null) return false; // not a JWT with exp: let the backend decide
  return Date.now() >= exp - skewSeconds * 1000;
};