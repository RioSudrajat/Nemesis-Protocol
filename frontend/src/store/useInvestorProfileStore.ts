"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KycStep = "username" | "email" | "kyc" | "complete";

export interface InvestorProfile {
  username: string;
  email: string;
  fullName: string;
  idType: "ktp" | "passport" | "";
  idNumber: string;
  kycSubmitted: boolean;
  completedSteps: KycStep[];
}

interface InvestorProfileState {
  profile: InvestorProfile;
  currentStep: KycStep;
  isProfileModalOpen: boolean;
}

interface InvestorProfileActions {
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setKycData: (data: Pick<InvestorProfile, "fullName" | "idType" | "idNumber">) => void;
  submitKyc: () => void;
  openProfileModal: (step?: KycStep) => void;
  closeProfileModal: () => void;
  advanceStep: () => void;
}

const STEP_ORDER: KycStep[] = ["username", "email", "kyc", "complete"];

const DEFAULT_PROFILE: InvestorProfile = {
  username: "",
  email: "",
  fullName: "",
  idType: "",
  idNumber: "",
  kycSubmitted: false,
  completedSteps: [],
};

export const useInvestorProfileStore = create<InvestorProfileState & InvestorProfileActions>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      currentStep: "username",
      isProfileModalOpen: false,

      setUsername: (username) =>
        set((s) => ({
          profile: { ...s.profile, username },
          currentStep: s.profile.completedSteps.includes("username") ? s.currentStep : "email",
        })),

      setEmail: (email) =>
        set((s) => ({
          profile: { ...s.profile, email },
        })),

      setKycData: (data) =>
        set((s) => ({
          profile: { ...s.profile, ...data },
        })),

      submitKyc: () =>
        set((s) => ({
          profile: {
            ...s.profile,
            kycSubmitted: true,
            completedSteps: ["username", "email", "kyc", "complete"],
          },
          currentStep: "complete",
        })),

      openProfileModal: (step) =>
        set((s) => ({
          isProfileModalOpen: true,
          currentStep: step ?? s.currentStep,
        })),

      closeProfileModal: () => set({ isProfileModalOpen: false }),

      advanceStep: () =>
        set((s) => {
          const idx = STEP_ORDER.indexOf(s.currentStep);
          const next = STEP_ORDER[idx + 1] ?? "complete";
          const completedSteps = Array.from(new Set([...s.profile.completedSteps, s.currentStep]));
          return {
            currentStep: next,
            profile: { ...s.profile, completedSteps },
          };
        }),
    }),
    { name: "nemesis-investor-profile" }
  )
);

/** Returns the first incomplete step */
export function getNextIncompleteStep(profile: InvestorProfile): KycStep {
  if (!profile.username) return "username";
  if (!profile.email) return "email";
  if (!profile.kycSubmitted) return "kyc";
  return "complete";
}

/** How many steps are done out of 3 */
export function getProfileProgress(profile: InvestorProfile): { done: number; total: number } {
  let done = 0;
  if (profile.username) done++;
  if (profile.email) done++;
  if (profile.kycSubmitted) done++;
  return { done, total: 3 };
}
