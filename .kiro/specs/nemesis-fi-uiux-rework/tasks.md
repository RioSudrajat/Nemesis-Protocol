# Implementation Plan: Nemesis FI UI/UX Rework (Gap Tasks)

## Overview

Phases 0–6 are already implemented. These tasks cover only the confirmed gaps identified in the design document, ordered by dependency: branding/nav fixes first, then new components, then page-level changes, then verification.

## Tasks

- [ ] 1. Fix root layout favicon
  - In `frontend/src/app/layout.tsx`, add `icons` to the `metadata` export pointing to `/noc-logo.png` for `icon`, `shortcut`, and `apple`.
  - _Requirements: 2.3_

- [ ] 2. Fix FiTopNav logo
  - In `frontend/src/components/fi/FiTopNav.tsx`, replace the current text/icon logo block with a Next.js `<Image src="/noc-logo.png" alt="Nemesis FI" width={40} height={40} className="rounded-2xl" priority />` inside the existing `<Link href="/fi">`.
  - Change the "Pools" nav link label to "EV Assets" (href remains `/fi/pools`).
  - _Requirements: 2.2, 2.4_

- [ ] 3. Fix FiHomeDashboard wallet-aware greeting
  - In `frontend/src/components/fi/FiHomeDashboard.tsx`, remove the hardcoded string `"Selembar Awan"`.
  - Read `publicKey` from `useSolanaWallet`; derive `shortAddress` as first 4 + last 4 chars of the base58 key.
  - Render `"Welcome back, {shortAddress}"` when connected, `"Welcome to Nemesis FI"` when not.
  - _Requirements: 4.2_

- [ ] 4. Fix FI pools page hero layout
  - In `frontend/src/app/(fi)/fi/pools/page.tsx`, locate the hero section container.
  - Remove any `grid`, `flex justify-between`, or `lg:grid-cols-*` classes from the headline+description wrapper.
  - Replace with `<div className="space-y-2">` containing the label `<p>`, headline `<h1>`, and description `<p>` in document order.
  - _Requirements: 6.3_

- [ ] 5. Add multi-pool cycling to FiFeaturedAssetCarousel
  - In `frontend/src/components/fi/FiFeaturedAssetCarousel.tsx`, add `activeIndex` state (`useState(0)`).
  - Derive `vm` from `pools[activeIndex]` instead of `pools[0]`.
  - Render indicator dots when `pools.length > 1`: a `<div>` of `<button>` elements with `aria-label="Go to campaign {i+1}"` and `aria-current` when active; active dot is `w-6 bg-zinc-950`, inactive is `w-2 bg-zinc-300`.
  - No auto-advance; navigation is user-driven only.
  - _Requirements: 4.4, 11.1, 11.2_

- [ ] 6. Create PoolDistributionTimeline component
  - Create `frontend/src/components/fi/PoolDistributionTimeline.tsx`.
  - Accept `distributions: YieldDistribution[]` as props.
  - Render a vertical timeline `<ol>` with `border-l-2 border-zinc-100`; each `<li>` has a teal dot, a `<time>` with formatted date, and a `<dl>` showing cash yield (teal), principal returned, and collection health percentage.
  - When `distributions` is empty, render `"No distributions recorded yet."`.
  - _Requirements: 10.7_

- [ ] 7. Create PoolDetailTabs component
  - Create `frontend/src/components/fi/PoolDetailTabs.tsx`.
  - Accept props: `pool: StakingPool`, `poolAssets: RegisteredVehicle[]`, `reports: PoolReport[]`, `distributions: YieldDistribution[]`, `teamMembers: { name: string; role: string; bio: string }[]`.
  - Define exactly five tabs: `overview`, `details`, `reports`, `impact`, `calculate` with labels `Overview`, `Details`, `Reports`, `Impact`, `Calculate`. No `documents` tab.
  - Manage `activeTab` state internally.
  - Wrap all tab content in a single white card: `<div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-950/10">`.
  - Separate sections within a tab using `<hr className="my-6 border-zinc-100" />`, not additional card wrappers.
  - Overview tab: pool economics as `<dl className="divide-y divide-zinc-100">` with inline label-value rows (Target APY, Collateral, Min investment, Units, Tenor) — no `Metric` mini-cards for these fields. Include `PoolDealFlow`.
  - Details tab: team members from `teamMembers` (fallback to `pool.managedBy`), linked assets via `poolAssets`.
  - Reports tab: use `ReportsTab` and `PoolDistributionTimeline` with `distributions`.
  - Impact tab: impact/risk content.
  - Calculate tab: investment calculator inputs + projected output values (may use `Metric` for emphasis here).
  - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 8. Wire PoolDetailTabs into pool detail page
  - In `frontend/src/app/(fi)/fi/pools/[poolId]/page.tsx`, remove the inline tab bar and tab content rendering.
  - Import and render `<PoolDetailTabs>` passing `pool`, `poolAssets`, `reports`, `distributions`, and `teamMembers`.
  - Ensure the two-column grid layout (`grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]`) is preserved with `PoolDetailTabs` in the left column and `PoolDetailSummaryRail` in the right column.
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 9. Checkpoint — verify all gaps are closed
  - Confirm favicon shows NOC logo in browser tab.
  - Confirm FiTopNav logo renders the image and nav label reads "EV Assets".
  - Confirm FiHomeDashboard shows no hardcoded name.
  - Confirm FI pools hero is a stacked block with no grid classes.
  - Confirm carousel shows indicator dots for multiple pools.
  - Confirm pool detail page has exactly 5 tabs (Overview/Details/Reports/Impact/Calculate), single card per tab, and economics as definition list.
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Phase 8 verification — lint, typecheck, build
  - [ ] 10.1 Run ESLint on modified files
    - Run `npm run lint` in `frontend/`; resolve any errors in FI, Earn, or Admin files touched by this rework.
    - _Requirements: 13.1_
  - [ ] 10.2 Run TypeScript type check
    - Run `npx tsc --noEmit` in `frontend/`; resolve any type errors in modified files.
    - _Requirements: 13.2_
  - [ ] 10.3 Run production build
    - Run `npm run build` in `frontend/`; resolve any build errors before marking complete.
    - _Requirements: 13.3_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (none in this plan — no property tests required per user instruction).
- Tasks are ordered by dependency: branding → new leaf components → page wiring → verification.
- All data flows from `useNemesisStore`; no component should compute labels, images, or economics independently.
