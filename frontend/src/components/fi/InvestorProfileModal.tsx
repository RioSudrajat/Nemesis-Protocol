"use client";

import { useState } from "react";
import { X, User, Mail, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import {
  useInvestorProfileStore,
  getNextIncompleteStep,
  type KycStep,
} from "@/store/useInvestorProfileStore";

const STEPS: { key: KycStep; label: string; icon: React.ElementType }[] = [
  { key: "username", label: "Username", icon: User },
  { key: "email", label: "Email", icon: Mail },
  { key: "kyc", label: "Identity", icon: FileText },
];

export function InvestorProfileModal() {
  const {
    profile,
    isProfileModalOpen,
    closeProfileModal,
    setUsername,
    setEmail,
    setKycData,
    submitKyc,
    advanceStep,
  } = useInvestorProfileStore();

  const [localUsername, setLocalUsername] = useState(profile.username);
  const [localEmail, setLocalEmail] = useState(profile.email);
  const [localFullName, setLocalFullName] = useState(profile.fullName);
  const [localIdType, setLocalIdType] = useState<"ktp" | "passport" | "">(profile.idType);
  const [localIdNumber, setLocalIdNumber] = useState(profile.idNumber);

  const activeStep = getNextIncompleteStep(profile);

  if (!isProfileModalOpen) return null;

  const stepIndex = STEPS.findIndex((s) => s.key === activeStep);

  function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localUsername.trim()) return;
    setUsername(localUsername.trim());
    advanceStep();
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localEmail.trim() || !localEmail.includes("@")) return;
    setEmail(localEmail.trim());
    advanceStep();
  }

  function handleKycSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localFullName.trim() || !localIdType || !localIdNumber.trim()) return;
    setKycData({ fullName: localFullName.trim(), idType: localIdType, idNumber: localIdNumber.trim() });
    submitKyc();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
        onClick={closeProfileModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-[1.75rem] border border-zinc-950/10 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
              Investor Profile
            </p>
            <h2 className="mt-0.5 text-lg font-black text-zinc-950">Complete investor profile</h2>
          </div>
          <button
            onClick={closeProfileModal}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-zinc-950/10 text-zinc-500 hover:bg-zinc-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 border-b border-zinc-100 px-6 py-4">
          {STEPS.map((step, i) => {
            const done = profile.completedSteps.includes(step.key);
            const active = step.key === activeStep;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black transition-colors ${
                      done
                        ? "bg-teal-600 text-white"
                        : active
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      active ? "text-zinc-950" : done ? "text-teal-700" : "text-zinc-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="mx-2 mb-4 h-4 w-4 shrink-0 text-zinc-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          {/* Step 1: Username */}
          {activeStep === "username" && (
            <form onSubmit={handleUsernameSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Username
                </label>
                <input
                  type="text"
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                  placeholder="e.g. satoshi_ev"
                  autoFocus
                  className="w-full rounded-2xl border border-zinc-950/10 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white"
                />
                <p className="mt-2 text-xs text-zinc-400">
                  This will appear as your display name across Nemesis FI.
                </p>
              </div>
              <button
                type="submit"
                disabled={!localUsername.trim()}
                className="w-full rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-40"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Email */}
          {activeStep === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Email address
                </label>
                <input
                  type="email"
                  value={localEmail}
                  onChange={(e) => setLocalEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  autoFocus
                  className="w-full rounded-2xl border border-zinc-950/10 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white"
                />
                <p className="mt-2 text-xs text-zinc-400">
                  Used for distribution notifications and report alerts.
                </p>
              </div>
              <button
                type="submit"
                disabled={!localEmail.trim() || !localEmail.includes("@")}
                className="w-full rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-40"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 3: KYC / Identity */}
          {activeStep === "kyc" && (
            <form onSubmit={handleKycSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Full legal name
                </label>
                <input
                  type="text"
                  value={localFullName}
                  onChange={(e) => setLocalFullName(e.target.value)}
                  placeholder="As on your ID document"
                  autoFocus
                  className="w-full rounded-2xl border border-zinc-950/10 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  ID type
                </label>
                <div className="flex gap-3">
                  {(["ktp", "passport"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLocalIdType(type)}
                      className={`flex-1 rounded-2xl border py-3 text-sm font-bold transition ${
                        localIdType === type
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-zinc-950/10 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                      }`}
                    >
                      {type === "ktp" ? "KTP" : "Passport"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  ID number
                </label>
                <input
                  type="text"
                  value={localIdNumber}
                  onChange={(e) => setLocalIdNumber(e.target.value)}
                  placeholder={localIdType === "passport" ? "A1234567" : "3271xxxxxxxxxxxxxx"}
                  className="w-full rounded-2xl border border-zinc-950/10 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={!localFullName.trim() || !localIdType || !localIdNumber.trim()}
                className="w-full rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-40"
              >
                Submit KYC
              </button>
              <p className="text-center text-xs text-zinc-400">
                Your data is stored locally and used only for Nemesis FI compliance.
              </p>
            </form>
          )}

          {/* Complete */}
          {activeStep === "complete" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-50">
                <CheckCircle2 className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-950">Profile complete</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Welcome, <span className="font-bold text-zinc-950">{profile.username}</span>. Your investor profile is set up.
                </p>
              </div>
              <button
                onClick={closeProfileModal}
                className="mt-2 w-full rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
              >
                Go to dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
