// File: front/src/shared/elements/email-verification-banner.element.tsx
// Last change: Replaced hardcoded text and fixed import paths.

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuthOptional } from "../../contexts/auth.optional";
import { useLocation } from "react-router-dom";
import { Alert } from "../base/alert.base";
import { useTranslation } from "../../contexts/translation.context";
import "./email-verification-banner.element.css";

const PENDING_VERIFICATION_KEY = "pendingEmailVerification";

const readPending = (): any | null => {
  try {
    const raw = localStorage.getItem(PENDING_VERIFICATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writePending = (value: any | null) => {
  try {
    if (value == null) localStorage.removeItem(PENDING_VERIFICATION_KEY);
    else localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(value));
  } catch {}
};

const pad2 = (n: number) => n.toString().padStart(2, "0");
const fmtMMSS = (sec: number) => `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;

interface VerificationInfo {
  email: string;
  expiresAt: number;
}

interface ResendResponse {
  ok: boolean;
  expiresIn?: number;
  user?: any;
  error?: string;
}

interface VerifyResponse {
  ok: boolean;
  user?: any;
  error?: string;
}

interface EmailVerificationBannerProps {
  allowedPaths?: string[];
  ns?: string;
  endpoints?: {
    resend: string;
    verifyCode: string;
  };
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  allowedPaths = ["/", "/dashboard", "/home"],
  ns = "elements",
  endpoints = {
    resend: "/api/auth/resend-verification",
    verifyCode: "/api/auth/verify-email-code",
  },
}) => {
  const auth = useAuthOptional();
  const location = useLocation();
  const { t, ensureNamespace } = useTranslation();

  useEffect(() => {
    void ensureNamespace(ns);
  }, [ns, ensureNamespace]);

  const [countdown, setCountdown] = useState<number>(0);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>("");
  const [bannerType, setBannerType] = useState<"info" | "success" | "warning" | "error">("info");
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const onAllowedPath = useMemo(() => allowedPaths.includes(location.pathname), [allowedPaths, location.pathname]);

  const armBanner = useCallback((info: VerificationInfo) => {
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((info.expiresAt - now) / 1000));

    setShowBanner(true);
    setBannerType("info");
    setBannerMessage(`${t(ns, "emailVerification.checkEmailPrefix")} (${info.email}) ${t(ns, "emailVerification.checkEmailSuffix")}`);
    setCountdown(timeLeft);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setBannerType("error");
          setBannerMessage(t(ns, "emailVerification.expired"));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      if (!bcRef.current) {
        bcRef.current = new BroadcastChannel("email_verification_channel");
        bcRef.current.onmessage = (event) => {
          if (event?.data?.type === "EMAIL_VERIFIED_SUCCESS") {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setBannerType("success");
            setBannerMessage(t(ns, "emailVerification.success"));
            if (event.data.user) auth?.setUser?.(event.data.user);
            writePending(null);
            auth?.setPendingEmailVerification?.(null as any);
            setTimeout(() => setShowBanner(false), 4000);
          }
        };
      }
    } catch {}
  }, [ns, auth?.setUser, t, auth?.setPendingEmailVerification]);

  const disarmBanner = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (bcRef.current) {
      try { bcRef.current.close(); } catch {}
      bcRef.current = null;
    }
    setShowBanner(false);
  }, []);

  useEffect(() => {
    if (!onAllowedPath) {
      disarmBanner();
      return;
    }
    const info: VerificationInfo | null = auth?.pendingEmailVerification || readPending();
    if (info && info.expiresAt > Date.now()) {
      armBanner(info);
    } else {
      disarmBanner();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (bcRef.current) {
        try { bcRef.current.close(); } catch {}
        bcRef.current = null;
      }
    };
  }, [onAllowedPath, auth?.pendingEmailVerification, armBanner, disarmBanner]);

  const handleResendEmail = useCallback(async () => {
    setResendError(null);
    setResendLoading(true);
    try {
      const info: VerificationInfo | null = auth?.pendingEmailVerification || readPending();
      if (!info?.email) {
        setResendError(t(ns, "emailVerification.error.missingEmail"));
        return;
      }
      const res = await fetch(endpoints.resend, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: info.email }),
      });
      const json: ResendResponse = await res.json().catch(() => ({ ok: false, error: "Bad JSON" }));
      if (!res.ok || !json.ok) {
        setResendError(json?.error || t(ns, "emailVerification.error.generic"));
        return;
      }
      const expiresInSec = typeof json.expiresIn === "number" ? json.expiresIn : 15 * 60;
      const next: VerificationInfo = { email: info.email, expiresAt: Date.now() + expiresInSec * 1000 };
      writePending(next);
      auth?.setPendingEmailVerification?.(next as any);
      armBanner(next);
      setBannerType("info");
      setBannerMessage(t(ns, "emailVerification.resent"));
    } catch (e) {
      setResendError(t(ns, "emailVerification.error.network"));
    } finally {
      setResendLoading(false);
    }
  }, [auth?.pendingEmailVerification, endpoints.resend, auth?.setPendingEmailVerification, armBanner, ns, t]);

  const handleVerifyCode = useCallback(async () => {
    setCodeError(null);
    setCodeLoading(true);
    try {
      const info: VerificationInfo | null = auth?.pendingEmailVerification || readPending();
      if (!info?.email) {
        setCodeError(t(ns, "emailVerification.error.missingEmail"));
        return;
      }
      if (!verificationCode || verificationCode.length !== 6) {
        setCodeError(t(ns, "emailVerification.error.badCode"));
        return;
      }
      const res = await fetch(endpoints.verifyCode, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: info.email, code: verificationCode }),
      });
      const json: VerifyResponse = await res.json().catch(() => ({ ok: false, error: "Bad JSON" }));
      if (!res.ok || !json.ok) {
        setCodeError(json?.error || t(ns, "emailVerification.error.generic"));
        return;
      }
      if (json.user) auth?.setUser?.(json.user);
      writePending(null);
      auth?.setPendingEmailVerification?.(null as any);
      try {
        const bc = new BroadcastChannel("email_verification_channel");
        bc.postMessage({ type: "EMAIL_VERIFIED_SUCCESS", user: json.user });
        bc.close();
      } catch {}
      setBannerType("success");
      setBannerMessage(t(ns, "emailVerification.success"));
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => setShowBanner(false), 3000);
    } catch (e) {
      setCodeError(t(ns, "emailVerification.error.network"));
    } finally {
      setCodeLoading(false);
    }
  }, [auth?.pendingEmailVerification, endpoints.verifyCode, verificationCode, auth?.setUser, auth?.setPendingEmailVerification, ns, t]);

  if (!showBanner) return null;

  return (
    <Alert
      type={bannerType}
      title={bannerType === "success" ? t(ns, "emailVerification.title.success") : t(ns, "emailVerification.title.required")}
      description={<>{bannerMessage}{(resendError || codeError) && <p className="verification-banner__error">{resendError || codeError}</p>}</>}
      onClose={() => setShowBanner(false)}
    >
      <div className="verification-banner__actions" data-testid="verification-actions">
        {bannerType === "info" && countdown > 0 && (
          <>
            <div className="verification-banner__countdown">
              <div className="verification-banner__time" aria-live="polite">⏰ {fmtMMSS(countdown)}</div>
              <button className="verification-banner__resend" onClick={handleResendEmail} disabled={resendLoading}>
                {resendLoading ? t(ns, "emailVerification.button.sending") : t(ns, "emailVerification.button.resend")}
              </button>
            </div>
            <div className="verification-banner__code">
              <input
                type="text"
                inputMode="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                placeholder={t(ns, "emailVerification.placeholder.code")}
                className="verification-banner__code-input"
                disabled={codeLoading}
                aria-label={t(ns, "emailVerification.aria.code")}
              />
              <button className="verification-banner__verify" onClick={handleVerifyCode} disabled={codeLoading || verificationCode.length !== 6}>
                {codeLoading ? t(ns, "emailVerification.button.verifying") : t(ns, "emailVerification.button.verify")}
              </button>
            </div>
          </>
        )}
      </div>
    </Alert>
  );
};

export default EmailVerificationBanner;
