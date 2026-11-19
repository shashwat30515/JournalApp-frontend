import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../../api/authApi";

import { consumeGoogleState } from "../../utils/googleAuth";
import { Spinner } from "../../components/common/Spinner";
import { setToken, setLoginMethod } from "../../api/axiosInstance";

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const state = params.get("state");
    const savedState = consumeGoogleState();

    console.log("[oauth] url:", window.location.href);
    console.log("[oauth] code present:", !!code, "| error:", error);
    console.log("[oauth] state match:", !!savedState && savedState === state);

    window.history.replaceState(null, "", window.location.pathname);

    if (error || !code) {
      toast.error(error ? `Google error: ${error}` : "No code received from Google.");
      navigate("/login", { replace: true });
      return;
    }
    if (!savedState || savedState !== state) {
      toast.error("Sign-in state mismatch. Start again from this same address (localhost:5173).");
      navigate("/login", { replace: true });
      return;
    }

    console.log("[oauth] calling backend...");
    authApi
      .googleLogin(code)
      .then(({ token }) => {
        console.log("[oauth] token received, length:", token.length);
        setToken(token);
        setToken(token);
       setLoginMethod("google");
        toast.success("Signed in with Google");
        navigate("/dashboard", { replace: true });
      })
      .catch((e) => {
        console.log("[oauth] backend call failed:", e?.response?.status, e?.message);
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return <Spinner label="Signing you in with Google..." />;
};