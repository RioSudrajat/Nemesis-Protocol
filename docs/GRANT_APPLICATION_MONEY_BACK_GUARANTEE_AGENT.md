# Nemesis Protocol Grant Application

## Project

**Nemesis Protocol** is a DePIN protocol for productive EV infrastructure assets, starting with ride-hailing and delivery EV bikes in Indonesia.

Nemesis turns real EV infrastructure into telemetry-verified, cashflow-generating on-chain financing products. Operators onboard productive assets, the protocol verifies asset activity and pool cashflows through standardized proofs, and investors receive transparent distributions from verified collections.

## Grant Track Fit

Nemesis is a strong fit for ecosystem grants focused on:

- DePIN
- Real-world assets
- Stablecoin payments
- On-chain credit markets
- Solana consumer and infrastructure use cases
- Southeast Asia market expansion

The project is built around practical physical infrastructure instead of speculative token incentives. Phase 1 uses EV rental bikes because the usage pattern, cashflow model, and telemetry requirements are realistic for Indonesia.

## Grant Request

**Requested support:** USD 100 to USD 200 equivalent.

**Primary use of funds:**

- Build the Money Back Guarantee Agent MVP.
- Implement reserve accounting and claim-state logic.
- Add smart contract primitives for pool status, reserve balances, and guarantee claims.
- Connect GPS-first proof data to investor-facing pool health.
- Ship a public demo with simulated operator, driver, investor, workshop, and admin flows.
- Prepare a pilot pool using Indonesia EV mobility assumptions.

## Problem

Investors want real-world yield, but early DePIN and RWA products often fail on trust:

- Assets are hard to verify.
- Revenue can be self-reported.
- Maintenance and downtime are invisible.
- Default handling is opaque.
- Investors do not know what happens when a real-world asset underperforms.

For productive EV infrastructure, this trust gap is even sharper because the asset is physical, mobile, depreciating, and operationally intensive.

## Solution

Nemesis solves this with a four-proof framework:

- **Proof of Asset:** verifies VIN or serial number, operator identity, deployment status, and pool mapping.
- **Proof of Activity:** verifies GPS route logs, daily distance, active usage hours, and movement consistency.
- **Proof of Revenue:** verifies expected collection, actual collection, lateness, and arrears state.
- **Proof of Maintenance:** verifies service due dates, completed repairs, reserve usage, and return-to-service status.

The Money Back Guarantee Agent sits on top of this proof layer. It monitors pool performance and triggers transparent guarantee states when a pool violates defined service-level thresholds.

## Money Back Guarantee Agent

The Money Back Guarantee Agent is a reserve-backed, rules-driven protection layer for early Nemesis pools.

It does **not** promise instant redemption or risk-free yield. Instead, it creates a transparent guarantee workflow for specific failure cases where the protocol, operator, or reserve structure has agreed to cover users.

### What The Agent Monitors

- Asset activation after funding.
- GPS activity consistency.
- Monthly collection status.
- Maintenance compliance.
- Default reserve balance.
- Operator reassignment speed.
- Pool-level distribution shortfalls.
- Maturity settlement readiness.

### Guarantee Trigger Examples

The agent can mark a guarantee claim as eligible when:

- A funded asset is not deployed within the agreed activation window.
- A unit remains inactive beyond the allowed grace period without reassignment.
- Operator collections miss the minimum threshold for a defined number of periods.
- Maintenance reserve funds are not used after a verified service trigger.
- Pool reporting is not submitted by the deadline.
- End-of-tenor residual settlement is not completed under the pool agreement.

### Guarantee Resolution Paths

Depending on the pool policy, the agent can route claims toward:

- Default reserve coverage.
- Operator top-up.
- Protocol fee escrow.
- Replacement asset assignment.
- Investor principal recovery acceleration.
- Maturity residual settlement.
- Manual admin review for disputed cases.

## Why This Matters

Most early RWA and DePIN products say "real yield" but leave users exposed to unclear off-chain failure modes. Nemesis makes those failure modes explicit.

The Money Back Guarantee Agent gives investors and grant reviewers a concrete answer to the question:

> What happens if the real-world asset does not perform?

The answer is not vague trust. It is a visible reserve, proof trail, claim state, and resolution workflow.

## Phase 1 Product

The first supported product is a **36-month Mobility Credit Pool** for productive EV bikes.

### Base Unit Assumptions

- EV bike, telemetry, setup, and onboarding: **Rp 25,000,000**
- Monthly gross collection per productive unit: **Rp 1,500,000**
- Tenor: **36 months**

### Monthly Split Per Unit

- Principal recovery: **45%** / Rp 675,000
- Investor yield: **20%** / Rp 300,000
- Maintenance reserve: **10%** / Rp 150,000
- Default reserve: **5%** / Rp 75,000
- Operator base fee: **8%** / Rp 120,000
- Operator performance fee: **2%** / Rp 30,000
- Protocol fee: **10%** / Rp 150,000

### Investor Economics

- Annual cash yield: **14.4%**
- Annual principal recovery: **32.4%**
- Total annual cash distribution: **46.8%**, clearly separated into yield and principal return.

Nemesis will not market the total distribution as pure APY.

## MVP Scope

The grant-funded MVP will include:

- Pool registry with phase 1 mobility credit pool data.
- Reserve ledger for maintenance, default, and protocol fee escrow.
- Guarantee policy configuration per pool.
- Agent-generated guarantee status for each pool.
- Claim lifecycle: pending, eligible, approved, resolved, rejected.
- Investor-facing guarantee dashboard.
- Operator-facing remediation dashboard.
- Admin review panel for disputed claims.
- Simulated proof feed for asset, activity, revenue, and maintenance.
- Solana-oriented contract interface design for future on-chain enforcement.

## Technical Architecture

### Frontend

- Next.js app router.
- TypeScript.
- Tailwind CSS.
- Zustand for demo state.
- Existing Nemesis portals:
  - DePIN dashboard.
  - FI investor platform.
  - RWA operator portal.
  - Workshop portal.
  - Admin portal.

### Protocol Layer

The MVP should model these core entities:

- `Pool`
- `Asset`
- `ProofRecord`
- `ReserveAccount`
- `GuaranteePolicy`
- `GuaranteeClaim`
- `Distribution`
- `OperatorPerformanceState`

### On-Chain Direction

Initial Solana program scope:

- Register pool metadata hash.
- Register asset proof hash.
- Register periodic proof checkpoints.
- Track reserve balances or escrow references.
- Track guarantee claim state transitions.
- Emit events for investor-facing transparency.

Stablecoin settlement should target IDRX or another compliant Indonesian rupiah stablecoin path where feasible.

## Milestones

### Milestone 1: Guarantee Policy Design

**Timeline:** 1-2 weeks

Deliverables:

- Final guarantee policy schema.
- Claim lifecycle model.
- Pool reserve accounting model.
- UI wireframe for investor and admin guarantee views.

### Milestone 2: Frontend MVP

**Timeline:** 2-4 weeks

Deliverables:

- FI pool dashboard with guarantee status.
- Operator remediation panel.
- Admin claim review panel.
- Simulated proof and reserve data.
- Public demo route.

### Milestone 3: Solana Interface Prototype

**Timeline:** 3-5 weeks

Deliverables:

- Program interface or Anchor prototype.
- Proof checkpoint event design.
- Guarantee claim state event design.
- Basic tests for claim eligibility and state transition logic.

### Milestone 4: Pilot Readiness

**Timeline:** 5-8 weeks

Deliverables:

- Demo pool using 20-unit and 50-unit assumptions.
- Pilot operating handbook.
- Risk disclosure and user-facing guarantee terms.
- Grant demo video script and walkthrough.

## Success Metrics

- One end-to-end pool demo with guarantee status visible.
- At least four proof types represented in the UI and data model.
- At least three guarantee triggers simulated.
- Claim state transitions verifiable through event logs or transaction references.
- Investor dashboard clearly separates yield, principal recovery, reserves, and guarantee coverage.
- Operator dashboard shows required remediation actions before guarantee payout.

## Why Nemesis Can Win

Nemesis is not trying to create another generic RWA marketplace. It starts with a specific, high-usage physical asset category in Indonesia and builds the trust layer around what actually matters:

- Is the asset real?
- Is it active?
- Is it producing revenue?
- Is it maintained?
- If it fails, what happens next?

The Money Back Guarantee Agent turns that final question into product infrastructure.

## Short Grant Pitch

Nemesis Protocol is building a DePIN financing layer for productive EV infrastructure assets in Indonesia, starting with ride-hailing and delivery EV bikes. The grant will fund a Money Back Guarantee Agent that monitors asset activity, revenue, maintenance, and reserve health, then triggers transparent guarantee workflows when funded assets fail to perform under defined pool rules. This makes real-world DePIN cashflows safer, more legible, and more credible for early investors.

## One-Liner

**Nemesis Protocol turns productive EV infrastructure into verified on-chain credit pools, with a Money Back Guarantee Agent that makes real-world failure modes transparent and reserve-backed.**
