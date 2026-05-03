# Nemesis Protocol Agentic Engineering Grant Application

## Project

**Nemesis Protocol** is a Solana DePIN platform that tokenizes Indonesia's productive EV infrastructure, starting with revenue-generating fleet vehicles and designed to expand into charging, solar, battery, and other income-producing EV infrastructure assets.

The project turns real EV infrastructure into telemetry-verified, cashflow-generating on-chain financing products. Operators onboard productive EV assets, the protocol verifies asset activity, revenue, and maintenance through standardized proofs, and investors receive transparent exposure to verified infrastructure cashflows.

## Short Description

Nemesis Protocol is a Solana DePIN platform for tokenizing productive EV infrastructure in Indonesia. The MVP starts with revenue-generating fleet vehicles and builds the proof, financing, and reporting rails needed to expand into charging stations, solar depots, battery storage, and other EV infrastructure assets.

## Problem

Indonesia's EV transition is accelerating, but productive EV infrastructure still lacks the financing and trust layer needed to scale.

Fleet operators need capital to deploy revenue-generating EV assets. Investors want exposure to real infrastructure cashflows. Drivers and local operators need more affordable access to EVs. But the market still has major gaps:

- Productive EV assets are expensive to deploy upfront.
- Asset activity is often opaque.
- Revenue reporting can be difficult to verify.
- Maintenance status is not transparent.
- Investors lack a clean way to understand real-world asset performance.
- Existing EV infrastructure growth needs better financing rails.

This creates a gap between government EV targets, real market demand, and the financing infrastructure needed to make deployment happen.

## Why Now

Indonesia is targeting a large-scale EV transition, including millions of electric vehicles by 2030. But current EV adoption is still far below those targets, which means there is significant room for growth.

At the same time, EV adoption needs more than vehicles. It needs charging, maintenance, telemetry, battery systems, solar depots, financing, and transparent operational data. Globally, the automotive industry is moving toward EVs and green energy, and Indonesia is responding through policy, incentives, and industrial strategy.

Nemesis is building on this real transition. The opportunity is not just to tokenize vehicles, but to create a protocol layer for productive EV infrastructure assets that can be financed, verified, monitored, and expanded over time.

## Solution

Nemesis introduces a three-layer protocol architecture:

### 1. Proof Layer

The proof layer verifies that productive EV infrastructure assets are real, active, earning, and maintained.

Nemesis standardizes every asset through four proofs:

- **Proof of Asset:** asset identity, VIN or serial number, operator identity, deployment status, and pool mapping.
- **Proof of Activity:** GPS route logs, distance traveled, active usage hours, route coverage, and operational consistency.
- **Proof of Revenue:** expected collection, actual collection, lateness, arrears, and payment history.
- **Proof of Maintenance:** service due dates, completed repairs, reserve usage, workshop proof, and return-to-service status.

### 2. Financing Layer

The financing layer structures productive EV assets into on-chain financing products.

Phase 1 starts with **Mobility Credit Pools** for revenue-generating EV fleet vehicles such as ride-hailing bikes, delivery bikes, cargo bikes, taxis, vans, and shuttle fleets.

Future products can support:

- Fleet remittance pools.
- Charging yield pools.
- Solar and battery yield pools.
- Integrated EV infrastructure pools.

### 3. Protocol Layer

The protocol layer coordinates telemetry ingestion, reserve logic, distribution records, scoring, monitoring, and investor-facing reporting.

This is what turns Nemesis from a simple asset-tokenization product into a DePIN protocol for productive infrastructure.

## Phase 1 Product

The first Nemesis product is a **36-month Mobility Credit Pool** for revenue-generating EV fleet vehicles.

For the hackathon MVP, the clearest launch wedge is productive EV bikes used for ride-hailing, delivery, and rental fleet operations.

### Base Unit Assumptions

- EV bike, telemetry, setup, and onboarding: **Rp 25,000,000**
- Monthly gross collection per productive unit: **Rp 1,500,000**
- Default tenor: **36 months**

### Monthly Split Per Unit

- Principal recovery: **45%** / Rp 675,000
- Investor yield: **20%** / Rp 300,000
- Maintenance reserve: **10%** / Rp 150,000
- Default reserve: **5%** / Rp 75,000
- Operator base fee: **8%** / Rp 120,000
- Operator performance fee: **2%** / Rp 30,000
- Protocol fee: **10%** / Rp 150,000

Nemesis clearly separates investor cash yield from principal recovery and does not market total cash distribution as pure APY.

## MVP Scope

The current MVP demonstrates the core product surfaces needed for the protocol:

- Public DePIN dashboard.
- FI investor pool marketplace.
- RWA operator portal.
- Driver GPS flow.
- Workshop and maintenance portal.
- Admin monitoring tools.
- Simulated proof data for asset, activity, revenue, and maintenance.
- Pool data for mobility credit products.
- Product documentation, PRD, and protocol blueprint.

The MVP is designed to show how productive EV assets move from onboarding, to proof verification, to financing, to investor-facing reporting.

## Solana Integration Direction

Nemesis is designed for Solana because low fees and high throughput fit frequent proof checkpoints, stablecoin payments, and transparent distribution records.

Initial Solana program direction:

- Register pool metadata hashes.
- Register asset proof hashes.
- Record periodic proof checkpoints.
- Emit events for proof updates and distribution records.
- Track reserve references and pool state.
- Support IDRX-oriented stablecoin settlement where feasible.

## Agentic Engineering Angle

This grant is especially relevant because Nemesis has been built and refined using agentic engineering workflows.

Codex was used as an engineering and product assistant to:

- Review the existing Nemesis repo.
- Read the README, PRD, and v2 blueprint.
- Identify gaps in project positioning.
- Rewrite grant and hackathon application answers.
- Create grant-ready documentation.
- Refine the project narrative around Solana, DePIN, productive EV infrastructure, and the four-proof framework.
- Help move from raw idea to structured product package quickly.

The work proves that agentic engineering can compress the time between idea, product architecture, documentation, and grant submission.

## Proof Of Work

Repository:

- `https://github.com/RioSudrajat/Nemesis-Protocol`

Important files:

- `README.md`
- `docs/PRD.md`
- `docs/NEMESIS_V2_BLUEPRINT.md`
- `docs/NEMESIS_Protocol_Pitch_EN.md`
- `docs/GRANT_APPLICATION_AGENTIC_ENGINEERING.md`

The repository contains the frontend MVP and product documentation for Nemesis Protocol.

## Grant Use

The grant will help cover an AI coding Pro subscription and support fast iteration during the Solana Frontier / Colosseum hackathon period.

The immediate goal is to keep shipping the MVP quickly:

- Clean up the frontend demo flow.
- Improve FI pool presentation.
- Strengthen RWA operator onboarding.
- Improve DePIN proof-of-activity demo.
- Prepare the final Colosseum submission.
- Continue using Codex for implementation, documentation, and application packaging.

## Milestones

### Milestone 1: Product Narrative And Grant Package

Deliverables:

- Final grant application package.
- Clear project positioning.
- Updated proof framework copy.
- README link to the grant package.

### Milestone 2: MVP Product Surface Cleanup

Deliverables:

- FI marketplace aligned with mobility credit pools.
- RWA operator flow aligned with productive EV infrastructure onboarding.
- DePIN dashboard aligned with GPS-first proof of activity.
- Demo routes ready for judges.

### Milestone 3: Solana Integration Design

Deliverables:

- Pool metadata and proof checkpoint design.
- Distribution and reserve event model.
- IDRX-oriented settlement direction.
- Colosseum demo walkthrough.

## One-Liner

**Nemesis Protocol tokenizes Indonesia's productive EV infrastructure on Solana, starting with revenue-generating fleet vehicles and expanding toward charging, solar, battery, and other income-producing EV infrastructure assets.**
