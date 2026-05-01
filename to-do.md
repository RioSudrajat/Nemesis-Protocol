# Nemesis Frontend v2 Rework To-Do

## Goal

Bring the current frontend narrative, data model, and demo UX in line with the v2 blueprint:

> Nemesis Protocol is a DePIN for productive EV infrastructure assets.

Primary product scope:

- Mobility Assets
- Charging Assets
- Energy Assets

Standard proof framework:

- Proof of Asset
- Proof of Activity
- Proof of Revenue
- Proof of Maintenance

Remove legacy framing across public and demo surfaces:

- Fractional shares
- 1,000 shares
- Fixed share price
- 30-41% APY
- Weekly yield
- 70/20/7/3 distribution logic

## Audit Findings

### P1 - FI Still Uses Legacy Shares/APY Product Model

Affected files:

- `frontend/src/app/(fi)/fi/page.tsx`
- `frontend/src/app/(fi)/fi/pools/[poolId]/page.tsx`
- `frontend/src/app/(fi)/fi/portfolio/page.tsx`
- `frontend/src/store/useFiStore.ts`
- `frontend/src/data/pools.ts`

Current issue:

- FI is still built around `sharesTotal`, `pricePerShare`, `apyMin`, `apyMax`, weekly distribution, and calculators for share quantity / weekly yield.

Target direction:

- Replace with phase-1 financial products:
- 36-month mobility credit pool
- Cash yield
- Principal recovery
- Default reserve
- Operator fee
- Protocol fee

### P1 - Landing Page Below Hero Still Sells Old Narrative

Affected files:

- `frontend/src/components/landing/DecisionSection.tsx`
- `frontend/src/components/landing/ScaleSection.tsx`
- `frontend/src/components/landing/DecisionEasySection.tsx`
- `frontend/src/components/landing/FinalCtaSection.tsx`
- `frontend/src/components/landing/TokenomicsSection.tsx`

Current issue:

- Still contains "Fractional Ownership", "30,000 IDRX per share", "30-41.6% APY", "70/20/7/3 distribution logic", and "direct weekly yield".

Target direction:

- Problem: productive EV infrastructure is underfinanced.
- Thesis: Nemesis turns verified EV infrastructure cashflows into on-chain products.
- Phase 1: ride-hailing / delivery / cargo mobility pools.
- Future expansion: charging / swap / solar / storage.
- Tokenomics should become a future layer, not the core demo promise.

### P1 - RWA Public Pages Still Use Fleet Tokenization / Share Minting

Affected files:

- `frontend/src/components/rwa/public/RwaHeroSection.tsx`
- `frontend/src/components/rwa/public/RwaTokenizationFlowSection.tsx`
- `frontend/src/components/rwa/public/RwaFinalCtaSection.tsx`

Current issue:

- Still shows "1.000 shares", IDRX share badges, "Revenue: Weekly", "Mint shares", and "1.000 SPL shares".

Target direction:

- Reposition RWA as onboarding productive EV infrastructure assets into verified financing rails.
- Move away from fixed-share framing.

### P1 - RWA Asset Catalog/Detail Still Uses APY And Share Price

Affected files:

- `frontend/src/app/(rwa)/rwa/assets/page.tsx`
- `frontend/src/app/(rwa)/rwa/assets/[assetId]/page.tsx`
- `frontend/src/components/rwa/public/assetCatalog.ts`

Current issue:

- Exposes Projected APY, Share price, and `pricePerShare`.
- Catalog is still mobility-only.

Target direction:

- Split asset catalog into:
- Phase 1 eligible mobility assets
- Future charging / energy asset classes
- Replace metrics with:
- Pool model
- Revenue model
- Minimum eligible deployment
- Proof requirements

### P1 - Operator Mint Flow Still Share-Based

Affected file:

- `frontend/src/app/(rwa)/rwa/operator/mint/page.tsx`

Current issue:

- Shows 1,000 shares per vehicle, Total Shares, and Rp 30,000,000 per unit.

Target direction:

- Use phase-1 assumptions:
- Capex assumption: Rp 25,000,000
- Register assets
- Configure revenue model
- Attach telemetry
- Submit proof readiness
- Open funding eligibility

### P2 - DePIN Has Legacy Ownership/Yield Language

Affected files:

- `frontend/src/app/(depin)/depin/earn/page.tsx`
- `frontend/src/app/(depin)/depin/pool/[poolId]/page.tsx`

Current issue:

- Uses "Own your share", "Variable yields", and "pool shareholders".

Target direction:

- Use language like:
- Pool participants
- Credit pool backers
- Verified investors

### P2 - Driver/Network Activity Is Still Trip-Centric

Affected files:

- `frontend/src/components/depin/ActivityTripMap.tsx`
- `frontend/src/app/(depin)/depin/driver/page.tsx`
- `frontend/src/store/useDriverStore.ts`
- `frontend/src/store/useDepinStore.ts`
- `frontend/src/types/driver.ts`
- `frontend/src/types/depin.ts`

Current issue:

- Uses `tripsToday` and trip-centric naming.

Target direction:

- GPS-first devnet language:
- Daily route logs
- Distance traveled
- Active usage hours
- Movement segments
- Route coverage

### P2 - Proof Framework Is Not Consistent

Affected examples:

- `frontend/src/components/rwa/public/RwaHeroSection.tsx`
- Other public/DePIN surfaces with partial proof labels

Current issue:

- Some pages only mention 2-3 proofs.
- Proof of Maintenance is often missing.

Target direction:

- Standardize the four-proof framework everywhere:
- Proof of Asset
- Proof of Activity
- Proof of Revenue
- Proof of Maintenance

### P2 - Global Metadata Still Uses Old Positioning

Affected files:

- `frontend/src/app/layout.tsx`
- `frontend/src/app/(marketing)/page.tsx`

Current issue:

- Root metadata still says "NOC ID - Trustless Vehicle Identity on Solana".
- Marketing metadata still says "Earn 30-41% APY...".

Target direction:

- Align metadata with v2 protocol positioning.

### P3 - Tokenomics/Staking Is Too Early For Current Demo

Affected files:

- `frontend/src/components/landing/TokenomicsSection.tsx`
- `frontend/src/app/(fi)/layout.tsx`

Current issue:

- $NMS, yield multipliers, buybacks, and staking are too prominent for the current demo readiness.

Target direction:

- Reframe tokenomics as a future protocol layer / coming later.

### P2 - Frontend Data/Copy Is Too Scattered

Affected examples:

- `frontend/src/app/(fi)/fi/page.tsx`
- `frontend/src/app/(fi)/fi/pools/[poolId]/page.tsx`
- `frontend/src/app/(depin)/depin/earn/page.tsx`
- `frontend/src/components/rwa/public/assetCatalog.ts`
- `frontend/src/data/*`

Current issue:

- Key copy and product numbers live in page-level constants and scattered data files.

Target direction:

- Create a typed content/config layer before deeper rewrites.

## Execution Plan

### Phase 1 - Types And Content Foundation

Purpose:

- Create one frontend source of truth before rewriting pages.

Tasks:

- Create `frontend/src/content/nemesis/protocol.ts`
- Create `frontend/src/content/nemesis/assetClasses.ts`
- Create `frontend/src/content/nemesis/proofs.ts`
- Create `frontend/src/content/nemesis/pools.ts`
- Move protocol headlines, proof labels, product categories, CTAs, and demo pool data into typed config.
- Update `frontend/src/types/fi.ts` to support:
- `poolType`
- `tenorMonths`
- `cashYieldPct`
- `principalRecoveryMonthly`
- `defaultReservePct`
- `operatorBaseFeePct`
- `operatorPerformanceFeePct`
- `protocolFeePct`
- `proofStatus`
- Update `frontend/src/types/rwa.ts` to remove or de-emphasize fixed-share semantics.
- Update `frontend/src/types/driver.ts` and `frontend/src/types/depin.ts` to add:
- `routeLogsToday`
- `distanceTodayKm`
- `activeHoursToday`
- `movementSegments`

Acceptance checklist:

- Core v2 terms exist in one content layer.
- New FI pool model can represent mobility credit pools without shares/APY.
- Driver/DePIN types can represent GPS-first activity.

### Phase 2 - FI Product Rebuild

Purpose:

- FI is the furthest from blueprint v2, so refactor it before copy polish elsewhere.

Affected files:

- `frontend/src/app/(fi)/fi/page.tsx`
- `frontend/src/app/(fi)/fi/pools/[poolId]/page.tsx`
- `frontend/src/app/(fi)/fi/portfolio/page.tsx`
- `frontend/src/store/useFiStore.ts`
- `frontend/src/data/pools.ts`
- New or updated content files under `frontend/src/content/nemesis/`

Tasks:

- Rebuild FI homepage from APY marketplace into product-type marketplace:
- Mobility Credit Pools
- Fleet Remittance Pools
- Charging / Energy Yield Pools as upcoming
- Replace pool card metrics with:
- Cash yield
- Principal recovery
- Tenor
- Revenue model
- Proof status
- Operator profile
- Replace pool detail calculator:
- From shares owned / weekly yield
- To estimated monthly cash yield, monthly principal recovery, annual cash distribution, remaining principal, and maturity settlement
- Replace portfolio semantics:
- Position size
- Cash yield received
- Principal recovered
- Remaining principal exposure
- Pool tenor / maturity

Acceptance checklist:

- No FI surface uses "share price", "weekly yield", or "30-41% APY".
- FI can explain phase-1 36-month mobility credit pools clearly.

### Phase 3 - RWA Public And Operator Repositioning

Purpose:

- Move RWA from share minting into verified infrastructure onboarding.

Affected files:

- `frontend/src/components/rwa/public/RwaHeroSection.tsx`
- `frontend/src/components/rwa/public/RwaAssetModulesSection.tsx`
- `frontend/src/components/rwa/public/RwaTokenizationFlowSection.tsx`
- `frontend/src/components/rwa/public/RwaFinalCtaSection.tsx`
- `frontend/src/components/rwa/public/assetCatalog.ts`
- `frontend/src/app/(rwa)/rwa/assets/page.tsx`
- `frontend/src/app/(rwa)/rwa/assets/[assetId]/page.tsx`
- `frontend/src/app/(rwa)/rwa/operator/mint/page.tsx`

Tasks:

- Rewrite RWA hero around verified financing rails.
- Add three asset class framing:
- Mobility
- Charging
- Energy
- Split catalog into phase-1 eligible mobility assets and future asset classes.
- Replace APY/share-price cards with pool model, revenue model, minimum eligible deployment, proof requirements.
- Replace operator mint flow with:
- Register assets
- Configure revenue model
- Attach telemetry
- Submit proof readiness
- Open funding eligibility
- Update capex assumption to Rp 25,000,000.

Acceptance checklist:

- No RWA public page says "mint shares" as the main action.
- Asset detail pages explain pool/product model instead of share price.
- Operator onboarding matches phase-1 blueprint.

### Phase 4 - Landing Page Rewrite Below Hero

Purpose:

- Keep the visual direction, but make the narrative consistent with v2.

Affected files:

- `frontend/src/components/landing/DecisionSection.tsx`
- `frontend/src/components/landing/ScaleSection.tsx`
- `frontend/src/components/landing/DecisionEasySection.tsx`
- `frontend/src/components/landing/FinalCtaSection.tsx`
- `frontend/src/components/landing/TokenomicsSection.tsx`
- `frontend/src/components/landing/HeroSection.tsx`

Tasks:

- Keep hero mostly intact but replace ownership/tokenized-ownership language with investable cashflow product language.
- Rewrite sections around:
- Underfinanced productive EV infrastructure
- Verified EV infrastructure cashflows
- Phase-1 mobility pools
- Future charging / swap / solar / storage expansion
- Reframe tokenomics as "future protocol layer" or "coming later".

Acceptance checklist:

- Landing no longer contradicts v2 after scroll.
- No legacy APY/share/weekly-yield copy remains.

### Phase 5 - DePIN Proof Experience Cleanup

Purpose:

- Align DePIN with GPS-first proof-of-activity demo.

Affected files:

- `frontend/src/app/(depin)/depin/earn/page.tsx`
- `frontend/src/app/(depin)/depin/pool/[poolId]/page.tsx`
- `frontend/src/app/(depin)/depin/driver/page.tsx`
- `frontend/src/app/(depin)/depin/driver/trips/page.tsx`
- `frontend/src/components/depin/ActivityTripMap.tsx`
- `frontend/src/store/useDriverStore.ts`
- `frontend/src/store/useDepinStore.ts`
- `frontend/src/types/driver.ts`
- `frontend/src/types/depin.ts`

Tasks:

- Replace shareholder language with pool participant / credit pool backer language.
- Rename trip-centric surfaces where appropriate:
- `ActivityTripMap` -> `ActivityRouteMap` or `DailyRouteLogMap`
- `/driver/trips` -> `/driver/activity` or `/driver/route-logs`
- Update activity metrics:
- Route trace
- Active hours
- Km/day
- Active/idle patterns
- Proof hash status

Acceptance checklist:

- DePIN demo reads as GPS-first route proof, not trip-booking software.
- Pool access copy no longer says "shareholders".

### Phase 6 - Metadata, Tokenomics De-Emphasis, And QA

Purpose:

- Final consistency pass after core product semantics are fixed.

Affected files:

- `frontend/src/app/layout.tsx`
- `frontend/src/app/(marketing)/page.tsx`
- `frontend/src/components/landing/TokenomicsSection.tsx`
- `frontend/src/app/(fi)/layout.tsx`

Tasks:

- Update root metadata.
- Update marketing metadata.
- De-emphasize tokenomics/staking until backend/smart-contract readiness improves.
- Run copy consistency search:
- `shares`
- `share price`
- `APY`
- `weekly yield`
- `70/20/7/3`
- `mint shares`
- `shareholders`
- Run targeted lint and build.

Acceptance checklist:

- App metadata matches current PRD/blueprint.
- Legacy narrative terms are removed or intentionally isolated as future/historical context.
- `npm run build` passes.

## Recommended Work Order

1. Phase 1 - Types and content foundation.
2. Phase 2 - FI product rebuild.
3. Phase 3 - RWA public and operator repositioning.
4. Phase 4 - Landing page rewrite below hero.
5. Phase 5 - DePIN proof experience cleanup.
6. Phase 6 - Metadata, tokenomics de-emphasis, and QA.

## Notes

- This audit focuses on marketing, RWA, FI, DePIN, and the data/types/store layer that affects copy and demo logic.
- Workshop and admin are intentionally out of scope for this pass.
- This plan audits positioning, copywriting, IA, product semantics, and demo readiness.
- Visual polish and accessibility can be audited after the semantic/product model is corrected.
