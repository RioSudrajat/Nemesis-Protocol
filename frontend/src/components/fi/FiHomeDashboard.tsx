"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FiFeaturedAssetCarousel } from "./FiFeaturedAssetCarousel";
import { FiNotificationsPanel } from "./FiNotificationsPanel";
import { FiProjectUpdates } from "./FiProjectUpdates";
import { InvestorProfileModal } from "./InvestorProfileModal";
import { getPublicPools } from "@/lib/poolCampaignViewModel";
import { formatIDRXFull } from "@/lib/yield";
import { selectInvestorPortfolio, useNemesisStore } from "@/store/useNemesisStore";
import { useSolanaWallet } from "@/context/SolanaWalletContext";
import {
  useInvestorProfileStore,
  getNextIncompleteStep,
  getProfileProgress,
} from "@/store/useInvestorProfileStore";

export function FiHomeDashboard() {
  const state = useNemesisStore();
  const { address } = useSolanaWallet();
  const { profile, openProfileModal } = useInvestorProfileStore();

  const positions = selectInvestorPortfolio(state);
  const publicPools = getPublicPools(state.pools);

  // Display name: username > short wallet address > null
  const displayName = profile.username
    ? profile.username
    : address
    ? `${address.slice(0, 4)}…${address.slice(-4)}`
    : null;

  const totalYield = positions.reduce((sum, p) => sum + p.cashYieldReceived, 0);
  const avgYield = positions.length
    ? positions.reduce((sum, p) => sum + p.cashYieldPct, 0) / positions.length
    : publicPools.length
    ? publicPools.reduce((sum, p) => sum + p.cashYieldPct, 0) / publicPools.length
    : 0;
  const nextPayout = positions.map((p) => p.nextDistribution).sort()[0];

  const { done, total } = getProfileProgress(profile);
  const isProfileComplete = done === total;
  const nextStep = getNextIncompleteStep(profile);

  return (
    <div className="px-4 py-8 text-zinc-950 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Greeting */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Nemesis FI</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
            {displayName ? `Welcome back, ${displayName}` : "Welcome to Nemesis FI"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Monitor productive EV infrastructure financing, yield reports, and live campaigns.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Portfolio summary */}
          <section className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400">
              Total yield earned
            </p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-4xl font-black tracking-tight text-zinc-950">
                {formatIDRXFull(totalYield)}
              </p>
              <span className="mb-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                +{avgYield.toFixed(1)}%
              </span>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-950/10 pt-5">
              <MiniStat label="Avg cash yield" value={`${avgYield.toFixed(1)}%`} />
              <MiniStat label="Positions" value={`${positions.length}`} />
              <MiniStat
                label="Next payout"
                value={
                  nextPayout
                    ? new Date(nextPayout).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "N/A"
                }
              />
            </div>
          </section>

          {/* Investor profile card */}
          <section className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-zinc-950">
                  {isProfileComplete ? "Investor profile" : "Complete investor profile"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {isProfileComplete
                    ? "Your profile and KYC are verified."
                    : "Set up your username, email, and identity to unlock full access."}
                </p>
              </div>
              {!isProfileComplete && (
                <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  {done} of {total}
                </span>
              )}
            </div>

            {/* Progress steps */}
            {!isProfileComplete && (
              <div className="mt-5 space-y-2">
                <ProfileStep
                  label="Set username"
                  done={!!profile.username}
                  active={nextStep === "username"}
                  onClick={() => openProfileModal("username")}
                />
                <ProfileStep
                  label="Add email"
                  done={!!profile.email}
                  active={nextStep === "email"}
                  onClick={() => openProfileModal("email")}
                />
                <ProfileStep
                  label="Verify identity (KYC)"
                  done={profile.kycSubmitted}
                  active={nextStep === "kyc"}
                  onClick={() => openProfileModal("kyc")}
                />
              </div>
            )}

            {isProfileComplete ? (
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-teal-50 px-4 py-3">
                <p className="text-sm font-bold text-teal-700">@{profile.username}</p>
                <Link
                  href="/fi/pools"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"
                >
                  Browse pools <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => openProfileModal(nextStep)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
              >
                Continue setup <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </section>
        </div>

        <FiFeaturedAssetCarousel pools={publicPools} />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <FiProjectUpdates reports={state.poolReports} pools={state.pools} />
          <FiNotificationsPanel reports={state.poolReports} pools={publicPools} />
        </div>
      </div>

      {/* KYC modal — rendered at dashboard level */}
      <InvestorProfileModal />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">{label}</p>
      <p className="mt-2 text-xl font-black text-zinc-950">{value}</p>
    </div>
  );
}

function ProfileStep({
  label,
  done,
  active,
  onClick,
}: {
  label: string;
  done: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={done}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition ${
        done
          ? "border-teal-100 bg-teal-50 text-teal-700 cursor-default"
          : active
          ? "border-zinc-950/15 bg-zinc-50 text-zinc-950 hover:bg-zinc-100"
          : "border-zinc-100 bg-white text-zinc-400 cursor-not-allowed"
      }`}
    >
      <span>{label}</span>
      {done ? (
        <span className="text-xs font-black text-teal-600">✓ Done</span>
      ) : active ? (
        <ArrowRight className="h-4 w-4 text-zinc-500" />
      ) : (
        <span className="text-xs text-zinc-300">Locked</span>
      )}
    </button>
  );
}
