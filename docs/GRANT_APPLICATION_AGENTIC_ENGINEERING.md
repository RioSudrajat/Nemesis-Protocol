# Nemesis Protocol - Superteam Agentic Engineering Grant Application

## Project Name

Nemesis Protocol

## One-Line Summary

Nemesis Protocol is a Solana DePIN protocol that turns productive EV infrastructure in Indonesia into telemetry-verified, cashflow-generating on-chain financing products.

## Short Description

Nemesis Protocol helps finance and verify real EV infrastructure assets, starting with productive EV fleet vehicles used for ride-hailing, delivery, and rental operations in Indonesia.

Operators onboard productive EV assets into the protocol. Nemesis verifies each asset through four standardized proofs: Proof of Asset, Proof of Activity, Proof of Revenue, and Proof of Maintenance. Investors then get transparent exposure to verified infrastructure cashflows through structured Solana-based financing pools.

The first product is a 36-month Mobility Credit Pool for revenue-generating EV bikes and other productive mobility assets. The longer-term vision is to expand the same proof and financing rails into chargers, battery storage, solar depots, and other income-producing EV infrastructure.

## What Are You Building?

I am building the MVP and Solana integration design for Nemesis Protocol, a DePIN financing layer for productive EV infrastructure.

The current MVP includes:

- A public DePIN dashboard for fleet activity and network telemetry.
- An FI investor interface for mobility credit pools.
- An RWA operator portal for asset onboarding and pool management.
- A driver GPS flow for Proof of Activity.
- A workshop portal for maintenance verification.
- Admin dashboards for monitoring assets, operators, pools, disputes, and proof health.
- Product documentation, protocol blueprint, pitch material, and grant package.

The MVP currently uses simulated proof and pool data to demonstrate the full product journey: asset onboarding, proof verification, pool structuring, monitoring, and investor-facing reporting.

## Problem

Indonesia's EV transition needs more than vehicles. It needs financing rails for productive EV infrastructure.

Fleet operators need capital to deploy EV bikes, delivery vehicles, taxis, vans, chargers, and depot infrastructure. Investors want access to real-world infrastructure cashflows. Drivers need more affordable access to productive EV assets. But the trust layer is missing.

Today, these assets are hard to finance because:

- Asset identity and deployment status are not always transparent.
- Activity is difficult to verify without telemetry.
- Revenue and remittance reporting can be opaque.
- Maintenance status is fragmented across operators and workshops.
- Investors lack clean reporting on real-world asset performance.
- Crypto-native capital has few practical channels into productive infrastructure.

Nemesis solves this by making each productive EV asset verifiable, financeable, and reportable through a protocol layer.

## Solution

Nemesis has three core layers.

### 1. Proof Layer

Every asset is verified through four proofs:

- Proof of Asset: VIN or serial, operator identity, deployment status, and pool mapping.
- Proof of Activity: GPS route logs, distance traveled, active hours, utilization, and movement consistency.
- Proof of Revenue: expected collection, actual collection, lateness, arrears, and payment history.
- Proof of Maintenance: service due dates, completed repairs, reserve usage, workshop confirmation, and return-to-service status.

### 2. Financing Layer

The first product is a 36-month Mobility Credit Pool for productive EV fleet assets.

For the initial ride-hailing EV bike model:

- Unit cost: Rp 25,000,000 per EV bike, including telemetry, setup, and onboarding.
- Monthly collection: Rp 1,500,000 per productive unit.
- Investor cash yield: 14.4% per year.
- Principal recovery: 32.4% per year.
- Total annual cash distribution: 46.8%, clearly separated between yield and principal recovery.

Monthly pool inflow is split into:

- 45% principal recovery.
- 20% investor yield.
- 10% maintenance reserve.
- 5% default reserve.
- 8% operator base fee.
- 2% operator performance fee.
- 10% protocol fee.

This makes the economics explicit and avoids vague APY claims.

### 3. Protocol Layer

The protocol layer coordinates telemetry ingestion, asset scoring, proof checkpoints, reserve logic, distribution records, operator monitoring, and future secondary transfer rails.

On Solana, the first integration direction is to:

- Register pool metadata hashes.
- Register asset proof hashes.
- Record periodic proof checkpoints.
- Emit events for proof updates and distribution records.
- Track pool state and reserve references.
- Support stablecoin-oriented settlement, with IDRX as a natural Indonesia-focused direction.

Solana is the right base layer because low fees and high throughput fit frequent proof checkpoints, pool state updates, and transparent stablecoin distribution records.

## Why This Matters To Solana

Nemesis gives Solana a practical DePIN/RWA use case rooted in real economic activity instead of pure token speculation.

It brings three important things to the ecosystem:

- Real-world productive infrastructure: EV bikes, fleet vehicles, chargers, solar depots, and energy assets.
- Frequent machine-linked proof events: GPS activity, revenue records, maintenance status, and pool updates.
- Stablecoin-based financing and distribution flows that can be demonstrated on Solana.

Indonesia is also a strong market for this experiment because productive mobility demand is already large, EV adoption is rising, and local stablecoin settlement through IDRX can make on-chain financing more understandable for Indonesian users.

## Why This Is Agentic Engineering

Nemesis is being built with an agentic engineering workflow.

I use AI coding agents as an active engineering partner to move from idea to product faster:

- Reading and refactoring the repository.
- Turning raw product thinking into a structured PRD and protocol blueprint.
- Drafting and improving grant applications.
- Designing the MVP information architecture.
- Building and refining Next.js product surfaces.
- Checking consistency across the DePIN, FI, RWA, workshop, and admin flows.
- Preparing the project for hackathon and grant submission.

This grant would directly support the AI-assisted engineering workflow that is making Nemesis possible as a solo or very small-team project.

The point is not just "I used AI to write copy." The point is that agentic tools let me compress the full cycle of product strategy, frontend implementation, documentation, grant packaging, and Solana integration planning into a much shorter build loop.

## Current Progress

The repository already includes:

- A Next.js 16 / React 19 frontend MVP.
- Public landing and protocol pages.
- DePIN dashboard and driver interfaces.
- FI pool marketplace and portfolio surfaces.
- RWA asset registry and operator flows.
- Workshop verification and maintenance pages.
- Admin dashboards for fleet, operators, workshops, disputes, roles, config, analytics, and audit views.
- Simulated datasets for vehicles, operators, pools, DePIN activity, booking, workshop, and admin workflows.
- Documentation for the PRD, V2 protocol blueprint, and pitch.

Repository:

https://github.com/RioSudrajat/Nemesis-Protocol

Important docs:

- README.md
- docs/PRD.md
- docs/NEMESIS_V2_BLUEPRINT.md
- docs/NEMESIS_Protocol_Pitch_EN.md
- docs/GRANT_APPLICATION_AGENTIC_ENGINEERING.md

## What The Grant Will Fund

The grant will fund AI coding tool usage and fast MVP iteration during the Solana Frontier / Colosseum build period.

Specifically, it will help me:

- Maintain access to AI coding agents for implementation and debugging.
- Finish the MVP demo flow across public, DePIN, FI, RWA, workshop, and admin surfaces.
- Improve the investor pool presentation and proof explanations.
- Tighten the operator onboarding and asset verification journey.
- Prepare a clear Solana integration spec for proof checkpoints and pool records.
- Package the final project for judges, users, and future partners.

## Milestones

### Milestone 1 - Grant And Product Narrative

Deliverables:

- Final Superteam grant application.
- Updated project positioning.
- Clean README and documentation links.
- Clear explanation of why Nemesis is DePIN, RWA, and agentic-engineered.

### Milestone 2 - MVP Demo Flow

Deliverables:

- Polished public landing page.
- FI pool marketplace aligned with Mobility Credit Pools.
- RWA operator onboarding aligned with productive EV infrastructure.
- DePIN proof-of-activity demo using GPS-first route data.
- Workshop maintenance verification flow.
- Admin monitoring walkthrough.

### Milestone 3 - Solana Integration Design

Deliverables:

- Pool metadata and proof checkpoint model.
- Asset proof hash registration design.
- Distribution and reserve event model.
- Stablecoin settlement direction.
- Demo walkthrough for hackathon and grant reviewers.

## Timeline

I can complete the grant-funded iteration within 2 to 3 weeks:

- Week 1: finalize product narrative, clean demo flows, and update grant/hackathon docs.
- Week 2: polish MVP pages, proof explanations, and investor/operator journeys.
- Week 3: finalize Solana integration design and record a complete demo walkthrough.

## Team

Nemesis Protocol is currently being built by Rio Sudrajat as a solo founder/builder, using agentic engineering workflows to accelerate product, frontend, documentation, and protocol design.

## Why Superteam Should Fund This

Superteam should fund Nemesis because it is a practical, Solana-native attempt to connect crypto infrastructure with real productive assets in Southeast Asia.

The project has:

- A clear market wedge: productive EV mobility in Indonesia.
- A practical first product: 36-month Mobility Credit Pools.
- A real DePIN proof layer: asset, activity, revenue, and maintenance proofs.
- A credible Solana direction: proof checkpoints, pool metadata, distribution events, and stablecoin settlement.
- A working frontend MVP and documentation base.
- A strong agentic engineering story: the project is being accelerated by AI coding agents from concept to grant-ready product.

Nemesis is not trying to sell a speculative token narrative. It is trying to build financing and verification rails for real EV infrastructure cashflows.

## Final One-Liner

Nemesis Protocol turns Indonesia's productive EV infrastructure into telemetry-verified, cashflow-generating Solana financing products, starting with ride-hailing EV fleets and expanding toward charging, solar, and battery infrastructure.
