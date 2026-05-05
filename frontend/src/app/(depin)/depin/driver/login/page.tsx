"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Phone, ArrowRight, ArrowLeft, Loader2, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDriverAuthStore } from "@/store/driverAuthStore";

export default function DriverLoginPage() {
  const router = useRouter();
  const {
    loginPhone,
    otpSent,
    error,
    isLoading,
    isAuthenticated,
    generatedOtp,
    setLoginPhone,
    sendOtp,
    verifyOtp,
    checkSession,
    clearError,
  } = useDriverAuthStore();

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check existing session
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/depin/driver");
    }
  }, [isAuthenticated, router]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Focus first OTP input when OTP screen shows
  useEffect(() => {
    if (otpSent) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [otpSent]);

  const handleSendOtp = () => {
    if (!loginPhone.trim()) return;
    sendOtp();
    setResendTimer(60);
    setOtpDigits(["", "", "", "", "", ""]);
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      clearError();

      const newDigits = [...otpDigits];
      newDigits[index] = value.slice(-1);
      setOtpDigits(newDigits);

      // Auto-advance to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-verify when all 6 digits entered
      const completeOtp = newDigits.join("");
      if (completeOtp.length === 6) {
        verifyOtp(completeOtp);
      }
    },
    [otpDigits, verifyOtp, clearError]
  );

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < paste.length; i++) {
      newDigits[i] = paste[i];
    }
    setOtpDigits(newDigits);
    if (paste.length === 6) {
      verifyOtp(paste);
    } else {
      inputRefs.current[paste.length]?.focus();
    }
  };

  const handleBack = () => {
    useDriverAuthStore.setState({ otpSent: false, generatedOtp: "", error: "" });
    setOtpDigits(["", "", "", "", "", ""]);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    sendOtp();
    setResendTimer(60);
    setOtpDigits(["", "", "", "", "", ""]);
  };

  const maskedPhone = loginPhone
    ? loginPhone.slice(0, 6) + "****" + loginPhone.slice(-2)
    : "";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(180deg, #060910 0%, #0a0e17 40%, #0d1220 100%)",
        color: "#E4E6EB",
      }}
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: "radial-gradient(circle, #14B8A6 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-60 -right-40 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, #2DD4BF 0%, transparent 70%)" }}
        />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-lg">
            <Image
              src="/noc_logo.png"
              alt="Nemesis Protocol"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-orbitron)] tracking-tight">
            Nemesis
          </h1>
          <p className="text-sm text-white/40 mt-1">Driver Portal</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          }}
        >
          {!otpSent ? (
            /* ── Phone Number Input ── */
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center">
                  <Phone size={18} className="text-[#14B8A6]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Sign in</h2>
                  <p className="text-xs text-white/40">Enter your registered phone number</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-sm text-white/40 font-medium">+62</span>
                    </div>
                    <input
                      type="tel"
                      value={loginPhone.replace(/^\+62/, "")}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setLoginPhone(val);
                      }}
                      placeholder="812 3456 7890"
                      className="w-full pl-14 pr-4 py-4 rounded-2xl text-white font-medium text-base placeholder:text-white/20 focus:outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(20,184,166,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.08)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={!loginPhone.trim() || loginPhone.replace(/\D/g, "").length < 9}
                  className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(20,184,166,0.25)",
                  }}
                >
                  Send OTP Code <ArrowRight size={18} />
                </button>
              </div>

              <p className="text-xs text-white/20 text-center mt-5">
                Only drivers registered by an operator can sign in.
              </p>
            </>
          ) : (
            /* ── OTP Verification ── */
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-5"
              >
                <ArrowLeft size={14} /> Change number
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center">
                  <KeyRound size={18} className="text-[#14B8A6]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Enter OTP</h2>
                  <p className="text-xs text-white/40">
                    Sent to {maskedPhone}
                  </p>
                </div>
              </div>

              {/* Mock OTP display — for demo purposes */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#14B8A6]/8 border border-[#14B8A6]/15 mb-5">
                <CheckCircle2 size={14} className="text-[#14B8A6] shrink-0" />
                <p className="text-xs text-[#14B8A6]/90">
                  <span className="font-bold">Demo mode:</span> Your OTP is{" "}
                  <span className="font-mono font-bold text-white tracking-wider">{generatedOtp}</span>
                </p>
              </div>

              {/* OTP Input boxes */}
              <div className="flex justify-center gap-2 mb-5" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: digit ? "rgba(20,184,166,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${digit ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(20,184,166,0.6)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = digit
                        ? "rgba(20,184,166,0.4)"
                        : "rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 size={20} className="text-[#14B8A6] animate-spin" />
                  <span className="text-sm text-white/50">Verifying...</span>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="text-xs transition-colors disabled:cursor-not-allowed"
                  style={{ color: resendTimer > 0 ? "rgba(255,255,255,0.25)" : "#14B8A6" }}
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend OTP code"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom help text */}
        <p className="text-center text-xs text-white/15 mt-8">
          Nemesis Protocol © 2026 — Driver access only
        </p>
      </div>
    </div>
  );
}
