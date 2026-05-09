# Requirements Document

## Introduction

Nemesis FI UI/UX Rework transforms the FI investor product from a sidebar-heavy internal portal into a calm, professional financing workspace. The rework introduces a top navigation shell, a home dashboard, a shared campaign card component, a redesigned portfolio page, and a credible pool detail due-diligence layout. The same campaign card is reused across FI Pools, DePIN Earn, and Admin, all driven by a single canonical view model derived from `useNemesisStore`.

The audit of the existing codebase (conducted against `docs/implementation_plan.md`) found that the following phases are **already implemented**:

- **Phase 0** — `poolCampaignViewModel.ts` exists and is complete.
- **Phase 1** — `FiTopNav.tsx` and `(fi)/layout.tsx` are complete; sidebar removed.
- **Phase 1A** — `FiHomeDashboard`, `FiFeaturedAssetCarousel`, `FiProjectUpdates`, `FiNotificationsPanel`, and `/fi/page.tsx` all exist. One gap: hardcoded username `"Selembar Awan"` in `FiHomeDashboard`.
- **Phase 2** — `PoolCampaignCard`, `PoolStatusBadge`, `PoolProgressBar` all exist and are complete.
- **Phase 3** — `/fi/pools/page.tsx` exists and uses `PoolCampaignCard` with derived stats.
- **Phase 3A** — Portfolio page and all five portfolio sub-components exist. `isConnected` is correctly read from `useSolanaWallet`. No `Principal recovered` top-level KPI card. `WorkshopRevenueChart` is not used.
- **Phase 4** — DePIN Earn uses `PoolCampaignCard mode="earn"` with waitlist modal.
- **Phase 5** — Admin pools page uses `PoolCampaignCard mode="admin"` with all admin actions.
- **Phase 6** — Pool detail page exists with `PoolDetailSummaryRail`, `PoolDealFlow`, `PoolOperatingAssetsTable`, `ReportsTab`. Tabs are functional.

The following items are **not yet implemented** or have **gaps**:

- `FiFeaturedAssetCarousel` only shows `pools[0]`; no multi-pool carousel with indicators.
- `FiHomeDashboard` has a hardcoded username (`"Selembar Awan"`) instead of a wallet-aware or generic greeting.
- Pool detail tab labels do not match the plan (`overview/reports/details/impact/calculate/documents` vs plan's `Deal Terms/Reports/Asset & Operator/Risks/Impact/Calculate Returns`).
- `PoolDetailTabs` component does not exist as a standalone component (tabs are inline in the page).
- `PoolDistributionTimeline` component does not exist (distribution history is an inline table).
- `PortfolioPositionList` component does not exist (the plan names it this; the implementation uses `PortfolioLiveProjects`, which is functionally equivalent but named differently).
- Phase 7 visual polish rules are not verified as applied.
- Phase 8 verification (lint, typecheck, build, browser QA) has not been run.

---

## Glossary

- **FI**: Financing Interface — the investor-facing product surface of Nemesis Protocol.
- **DePIN Earn**: The DePIN points-earning surface that surfaces FI campaigns to a broader audience.
- **Admin**: The internal moderation surface for reviewing and publishing pool campaigns.
- **StakingPool**: The canonical pool data type defined in `frontend/src/types/fi.ts`.
- **PoolCampaignViewModel**: The derived display object produced by `buildPoolCampaignViewModel` in `frontend/src/lib/poolCampaignViewModel.ts`.
- **PoolCampaignCard**: The shared campaign card component at `frontend/src/components/pools/PoolCampaignCard.tsx`.
- **FiTopNav**: The top navigation bar component at `frontend/src/components/fi/FiTopNav.tsx`.
- **FiHomeDashboard**: The home dashboard component at `frontend/src/components/fi/FiHomeDashboard.tsx`.
- **FiFeaturedAssetCarousel**: The featured pool carousel at `frontend/src/components/fi/FiFeaturedAssetCarousel.tsx`.
- **PoolDetailSummaryRail**: The sticky left summary rail on the pool detail page.
- **NemesisStore**: The canonical Zustand store at `frontend/src/store/useNemesisStore.ts`.
- **selectInvestorPortfolio**: The store selector that derives enriched investor positions.
- **IDRX**: The stablecoin denomination used for pool economics display.
- **Tenor**: The duration of a financing pool in months.
- **Cash yield**: The annualized percentage return paid to investors from pool collections.
- **Principal recovery**: The scheduled return of invested principal over the pool tenor.

---

## Requirements

### Requirement 1: Canonical Pool View Model

**User Story:** As a developer, I want a single view model adapter for pool display data, so that FI, DePIN Earn, and Admin never compute labels, images, or economics independently.

#### Acceptance Criteria

1. THE `PoolCampaignViewModel` SHALL expose `id`, `href`, `image`, `name`, `productLabel`, `operator`, `region`, `status`, `statusLabel`, `description`, `cashYield`, `principalRecovery`, `tenor`, `unitCount`, `supplied`, `target`, `fillPct`, `minInvestment`, `tags`, `proofLabel`, and `energyPointsEligible`.
2. WHEN `buildPoolCampaignViewModel` is called with a `StakingPool`, THE `PoolCampaignViewModel` SHALL derive all display fields from the pool and optional linked assets without requiring static overrides.
3. WHEN `pool.imageUrl` is absent or matches the placeholder pattern `/images/pool-*`, THE `PoolCampaignViewModel` SHALL assign a fallback image from the `FALLBACK_POOL_IMAGES` list using the provided index.
4. THE `getStatusTone` function SHALL return a CSS class string for each `PoolStatus` value: `active`, `filled`, `upcoming`, `pending_approval`, and `closed`.
5. THE `getPublicPools` function SHALL return only pools with status `active`, `filled`, or `upcoming`.
6. IF `linkedAssets` is provided and non-empty, THEN THE `PoolCampaignViewModel` SHALL set `unitCount` to `linkedAssets.length`; otherwise it SHALL fall back to `pool.unitCount`.

---

### Requirement 2: FI Top Navigation

**User Story:** As an investor, I want a calm top navigation bar on all FI pages, so that the product feels like a professional financing workspace rather than an internal admin portal.

#### Acceptance Criteria

1. THE `FiTopNav` SHALL render on all routes under the `(fi)` layout group: `/fi`, `/fi/pools`, `/fi/pools/[poolId]`, `/fi/portfolio`, and `/fi/stake`.
2. THE `FiTopNav` SHALL include a logo link that navigates to `/fi` using the image at `/public/noc-logo.png` rendered via Next.js `Image`.
3. THE browser tab favicon SHALL use `/public/noc-logo.png` (configured in the root layout or `app/favicon.ico` replacement).
4. THE `FiTopNav` SHALL include navigation links: `EV Assets` → `/fi/pools`, `Portfolio` → `/fi/portfolio`, `Future $NMS` → `/fi/stake`.
5. THE `FiTopNav` SHALL include a `ConnectWalletButton` loaded with `next/dynamic` and `ssr: false` to prevent hydration errors.
6. WHEN the current pathname matches a nav link's `href`, THE `FiTopNav` SHALL apply an active visual state to that link.
7. WHEN the viewport is below the `md` breakpoint, THE `FiTopNav` SHALL collapse nav links behind a toggle button and render them in a dropdown panel.
8. THE `(fi)/layout.tsx` SHALL NOT import or render `AppSidebar`.

---

### Requirement 3: FI Routing Structure

**User Story:** As an investor, I want `/fi` to be a home dashboard and `/fi/pools` to be the pool catalog, so that the product has a clear entry point and navigation hierarchy.

#### Acceptance Criteria

1. THE route `/fi` SHALL render the `FiHomeDashboard` component.
2. THE route `/fi/pools` SHALL render the FI pools listing page.
3. THE route `/fi/pools/[poolId]` SHALL render the pool detail page.
4. WHEN a user clicks the `FiTopNav` logo, THE browser SHALL navigate to `/fi`.
5. WHEN a user clicks the `Pools` nav link, THE browser SHALL navigate to `/fi/pools`.

---

### Requirement 4: FI Home Dashboard

**User Story:** As an investor, I want a home dashboard at `/fi` that summarizes my portfolio and highlights live campaigns, so that I can quickly understand what matters without navigating to multiple pages.

#### Acceptance Criteria

1. THE `FiHomeDashboard` SHALL display a portfolio summary tile derived from `selectInvestorPortfolio` showing total yield earned, average cash yield, active positions count, and next payout date.
2. THE `FiHomeDashboard` SHALL NOT display a hardcoded investor name; WHEN no wallet is connected, THE dashboard SHALL show a generic greeting or omit the name entirely.
3. THE `FiFeaturedAssetCarousel` SHALL display at least one public pool from the NemesisStore; WHEN no public pools exist, THE carousel SHALL render a quiet empty state.
4. WHEN multiple public pools exist, THE `FiFeaturedAssetCarousel` SHALL support cycling through them with carousel indicators.
5. THE `FiProjectUpdates` component SHALL derive its content from published `poolReports` in the NemesisStore and SHALL NOT display hardcoded project copy.
6. THE `FiNotificationsPanel` component SHALL derive notifications from published reports and upcoming pools in the NemesisStore.
7. IF no published reports or upcoming pools exist, THEN THE `FiNotificationsPanel` SHALL render a quiet empty state message.

---

### Requirement 5: Shared Campaign Card

**User Story:** As a developer, I want one campaign card component used across FI, DePIN Earn, and Admin, so that visual consistency is maintained and card markup is not duplicated.

#### Acceptance Criteria

1. THE `PoolCampaignCard` SHALL accept `pool`, `mode` (`"fi" | "earn" | "admin"`), `index`, `linkedAssets`, `onWaitlist`, and `adminActions` props.
2. THE `PoolCampaignCard` SHALL use `buildPoolCampaignViewModel` to derive all display data and SHALL NOT compute labels, images, or economics independently.
3. WHEN `mode` is `"fi"` and `pool.status` is `"upcoming"` and `onWaitlist` is provided, THE `PoolCampaignCard` SHALL render a `Join waitlist` button that calls `onWaitlist`.
4. WHEN `mode` is `"earn"`, THE `PoolCampaignCard` SHALL render a `View FI campaign` CTA for active/filled pools and a `Join waitlist` CTA for upcoming pools.
5. WHEN `mode` is `"admin"`, THE `PoolCampaignCard` SHALL render a status select, a view-details button, and a delete button.
6. WHEN `mode` is `"admin"` and `pool.status` is `"pending_approval"`, THE `PoolCampaignCard` SHALL additionally render `Approve` and `Reject` buttons.
7. THE `PoolStatusBadge` SHALL render a pill with the correct tone class from `getStatusTone` for each pool status.
8. THE `PoolProgressBar` SHALL display supplied amount, target amount, and fill percentage derived from the view model.
9. WHEN `vm.energyPointsEligible` is `true`, THE `PoolCampaignCard` SHALL render a `Points` badge in the image area.

---

### Requirement 6: FI Pools Listing Page

**User Story:** As an investor, I want a clean, scannable pool catalog at `/fi/pools`, so that I can evaluate campaigns without wading through marketing copy.

#### Acceptance Criteria

1. THE FI pools page SHALL derive all stats (total capital deployed, open target, average cash yield, campaign count) from `getPublicPools` applied to the NemesisStore and SHALL NOT use hardcoded values.
2. THE FI pools page SHALL render campaign cards using `PoolCampaignCard` with `mode="fi"`.
3. THE FI pools page hero section SHALL render the headline and description as a single stacked vertical block — NOT as a two-column or multi-column grid; the headline SHALL appear above the description with normal document flow.
4. THE FI pools page SHALL provide product-type filters as a segmented control.
5. WHEN a filter is selected, THE page SHALL show only pools matching that product type.
6. WHEN no pools match the active filter, THE page SHALL render a short empty state message.
7. WHEN an admin deletes or changes the status of a pool, THE FI pools page SHALL reflect the updated pool list through the NemesisStore.

---

### Requirement 7: FI Portfolio Page

**User Story:** As an investor, I want a portfolio page focused on yield and positions, so that I can understand my returns without being shown misleading or hardcoded financial stats.

#### Acceptance Criteria

1. WHEN a wallet is not connected, THE portfolio page SHALL render a connect-wallet prompt using the real wallet connection state from `useSolanaWallet` and SHALL NOT hardcode `isConnected = true`.
2. THE portfolio page SHALL display four KPI tiles: average annualized cash yield, total cash yield earned, next payout date, and active positions count — all derived from `selectInvestorPortfolio`.
3. THE portfolio page SHALL NOT display a top-level `Principal recovered` KPI card.
4. THE `PortfolioYieldAreaChart` SHALL render a line or area chart of cumulative cash yield over time derived from published pool reports and investor ownership ratios.
5. THE `PortfolioLiveProjects` component SHALL list active positions with pool name, cash yield percentage, tenor, and invested amount, each linking to `/fi/pools/[poolId]`.
6. THE `PortfolioClaimPanel` SHALL display the total cash yield earned as the claimable amount.
7. THE `PortfolioActivityTable` SHALL list investment and distribution transactions derived from positions and published reports.
8. WHEN no positions exist, THE portfolio page SHALL render a CTA linking to `/fi/pools`.

---

### Requirement 8: DePIN Earn Alignment

**User Story:** As a DePIN participant, I want Earn campaign cards to visually match FI campaign cards, so that the two surfaces feel like parts of the same product.

#### Acceptance Criteria

1. THE DePIN Earn page SHALL render campaign cards using `PoolCampaignCard` with `mode="earn"` for both active/filled and upcoming pools.
2. WHEN a user clicks `Join waitlist` on an upcoming pool card, THE Earn page SHALL open the email waitlist modal for that pool.
3. WHEN a user clicks `View FI campaign` on an active pool card, THE browser SHALL navigate to `/fi/pools/[poolId]`.
4. THE DePIN Earn page SHALL NOT contain duplicated campaign card markup outside of `PoolCampaignCard`.

---

### Requirement 9: Admin Pool List

**User Story:** As an admin, I want to manage pool campaigns using the same card foundation as FI and Earn, so that the admin surface feels like a control layer over the same objects rather than a separate product.

#### Acceptance Criteria

1. THE Admin pools page SHALL render all pools using `PoolCampaignCard` with `mode="admin"`.
2. THE Admin pools page SHALL support approve, reject, status change, delete, view details, and FI preview actions for each pool.
3. WHEN an admin changes a pool's status, THE NemesisStore SHALL update immediately and THE FI and Earn pages SHALL reflect the change.
4. WHEN an admin deletes a pool, THE NemesisStore SHALL remove the pool and release its linked assets, and THE FI and Earn pages SHALL no longer show that pool.
5. THE Admin pools page SHALL NOT contain duplicated campaign card markup outside of `PoolCampaignCard`.

---

### Requirement 10: FI Pool Detail Page

**User Story:** As an investor, I want a pool detail page that supports due diligence in a clear, structured layout, so that I can evaluate terms, assets, reports, and risks without feeling overwhelmed.

#### Acceptance Criteria

1. THE pool detail page SHALL use a two-column layout on desktop: a sticky `PoolDetailSummaryRail` on the right and a tabbed content area on the left.
2. THE `PoolDetailSummaryRail` SHALL display pool image, status, name, location, fill progress, cash yield, principal recovery, tenor, next distribution date, and a primary CTA.
3. THE pool detail page SHALL provide exactly five tabs with labels: `Overview`, `Details`, `Reports`, `Impact`, and `Calculate`.
4. EACH tab's content area SHALL be wrapped in a single white card container — tab content SHALL NOT be split across multiple separate cards; all sections within a tab live inside one card.
5. Pool economics and metadata fields (target APY, collateral, minimum investment, unit count, tenor, etc.) SHALL be rendered as a definition list or inline label-value rows inside the card — NOT as individual mini-cards or stat tiles.
6. THE `Overview` tab SHALL include `PoolDealFlow` showing the asset-to-investor revenue flow, rendered inside the single tab card.
7. THE `Reports` tab SHALL use `ReportsTab` and SHALL display only published reports from the NemesisStore, rendered inside the single tab card.
8. THE `Details` tab SHALL use `pool.teamMembers` for the core team section; WHEN `teamMembers` is empty, THE page SHALL fall back to `pool.managedBy`; linked assets SHALL use `selectAssetsByPool` from the NemesisStore.
9. THE `Calculate` tab SHALL allow the investor to input an investment amount and performance assumption and SHALL display projected monthly cash yield, monthly principal recovery, annual cash total, and maturity settlement.
10. WHEN a `poolId` does not match any pool in the NemesisStore, THE page SHALL render a not-found state with a link back to `/fi/pools`.
11. THE pool detail page SHALL include a breadcrumb navigation: `FI Home` → `Pools` → `[pool name]`.

---

### Requirement 11: FiFeaturedAssetCarousel Multi-Pool Support

**User Story:** As an investor, I want the home dashboard carousel to cycle through multiple featured campaigns, so that I can discover more than one opportunity from the dashboard.

#### Acceptance Criteria

1. WHEN more than one public pool exists, THE `FiFeaturedAssetCarousel` SHALL display carousel indicators allowing the user to navigate between pools.
2. WHEN a carousel indicator is clicked, THE carousel SHALL display the corresponding pool.
3. THE `FiFeaturedAssetCarousel` SHALL derive all displayed pool data from the NemesisStore via `buildPoolCampaignViewModel` and SHALL NOT use static campaign data.

---

### Requirement 12: Visual Polish and Accessibility

**User Story:** As an investor, I want the FI product to have consistent visual hierarchy and accessible interactive elements, so that the interface is easy to scan and use.

#### Acceptance Criteria

1. THE FI layout SHALL use a restrained neutral background (`#F4F5F6`) with white card surfaces and teal accents.
2. THE campaign cards SHALL use a maximum border radius of `24px` (`rounded-[1.5rem]`).
3. ALL interactive buttons and links SHALL have accessible labels via visible text, `aria-label`, or `title` attributes.
4. THE segmented filter controls on the FI pools page SHALL have a visible active state distinguishing the selected filter.
5. THE `FiTopNav` SHALL preserve keyboard focus and support tab navigation across all nav links and the wallet button.
6. WHEN rendered on a mobile viewport, THE `FiTopNav` SHALL not overflow or truncate nav link text.

---

### Requirement 13: Build and Quality Verification

**User Story:** As a developer, I want the reworked FI product to pass lint, typecheck, and build checks, so that the implementation is production-ready.

#### Acceptance Criteria

1. WHEN `npm run lint` is executed in the `frontend` directory, THE linter SHALL report zero errors related to FI, Earn, or Admin files modified in this rework.
2. WHEN `npx tsc --noEmit` is executed in the `frontend` directory, THE TypeScript compiler SHALL report zero type errors in files modified in this rework.
3. WHEN `npm run build` is executed in the `frontend` directory, THE build SHALL complete without errors.
4. THE routes `/fi`, `/fi/pools`, `/fi/portfolio`, `/fi/pools/[poolId]`, `/depin/earn`, and `/admin/pools` SHALL render without runtime errors in a browser.
5. WHEN an admin deletes a pool in `/admin/pools`, THE pool SHALL no longer appear in `/fi/pools` or `/depin/earn`.
6. WHEN an admin changes a pool status to `upcoming`, THE pool SHALL appear in the upcoming section of `/depin/earn` with a `Join waitlist` CTA.
