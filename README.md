<p align="center">
  <img src="frontend/public/noc_logo.png" alt="Nemesis Protocol" width="80" />
</p>

<h1 align="center">Nemesis Protocol</h1>

<p align="center">
  <strong>A DePIN protocol for productive EV infrastructure assets.</strong>
</p>

<p align="center">
  <a href="#key-features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#grant-package">Grant Package</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#license">License</a>
</p>

---

## TL;DR

Nemesis Protocol turns **productive EV infrastructure** — bikes, chargers, solar depots — into **telemetry-verified, cashflow-generating on-chain financing products**. Think DePIN meets real-world asset financing, starting with ride-hailing EV rental fleets in Indonesia.

Operators register productive assets → the protocol verifies activity, revenue & maintenance through four standardized proofs → investors fund assets through structured credit pools → verified cashflows are distributed back transparently.

No vague token stories. Real assets, real cashflows, real protocol revenue from day one.

---

## Key Features

### 🔗 Four-Proof Verification Framework

| Proof | What It Verifies |
|---|---|
| **Proof of Asset** | Asset identity, VIN/serial, ownership mapping, deployment status |
| **Proof of Activity** | GPS route logs, distance traveled, active hours, utilization rate |
| **Proof of Revenue** | Expected vs actual payments, lateness, arrears status |
| **Proof of Maintenance** | Service schedules, completed repairs, reserve usage, return-to-service |

### 💰 Structured Financing Products

- **Mobility Credit Pools** — 36-month rent-to-own pools for ride-hailing & delivery EV bikes
- **Fleet Remittance Pools** — Contracted remittance pools for taxis, vans, shuttles, buses
- **Yield Pools** — Revenue-share pools for chargers, swap stations, solar + storage assets

### 📊 DePIN Dashboard

- Real-time network telemetry & fleet activity monitoring
- GPS-first route proof visualization with interactive maps
- Operator & driver performance tracking
- Pool health metrics and distribution analytics

### 🏗️ RWA Asset Onboarding

- Multi-class asset registry (Mobility, Charging, Energy)
- Operator onboarding with telemetry attachment
- Proof readiness verification pipeline
- Funding eligibility workflow

### 🌐 Investor-Grade FI Platform

- Pool marketplace with transparent cashflow breakdowns
- Position tracking: yield received, principal recovered, remaining exposure
- Monthly distribution simulator
- Maturity & settlement visibility

---

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  Operators   │────▶│ Asset Onboard│────▶│ Proof Engine   │────▶│ Credit Pools │
│  register    │     │ + Telemetry  │     │ (4 Proofs)     │     │ (Financing)  │
│  EV assets   │     │  attachment  │     │                │     │              │
└─────────────┘     └──────────────┘     └───────────────┘     └──────┬───────┘
                                                                       │
                    ┌──────────────┐     ┌───────────────┐            │
                    │  Investors   │◀────│ Verified       │◀───────────┘
                    │  receive     │     │ Cashflow       │
                    │  distributions│    │ Distribution   │
                    └──────────────┘     └───────────────┘
```

**Phase 1 Economics (per EV bike unit):**

| Component | Split | Monthly (IDR) |
|---|---|---|
| Principal Recovery | 45% | Rp 675,000 |
| Investor Yield | 20% | Rp 300,000 |
| Maintenance Reserve | 10% | Rp 150,000 |
| Protocol Fee | 10% | Rp 150,000 |
| Operator Base Fee | 8% | Rp 120,000 |
| Default Reserve | 5% | Rp 75,000 |
| Operator Performance Fee | 2% | Rp 30,000 |

> **14.4% annual cash yield** + **32.4% principal recovery** = **46.8% total annual cash distribution** (honestly broken down, never marketed as pure yield).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Custom design tokens |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **3D / Visuals** | [Three.js](https://threejs.org/) via React Three Fiber + Drei |
| **Maps** | [MapLibre GL](https://maplibre.org/) + [Leaflet](https://leafletjs.com/) + [React Map GL](https://visgl.github.io/react-map-gl/) |
| **Globe** | [COBE](https://github.com/shuding/cobe) |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| **Data Fetching** | [TanStack Query 5](https://tanstack.com/query) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | Orbitron · Exo 2 · Fraunces · Plus Jakarta Sans (Google Fonts) |
| **Target Chain** | [Solana](https://solana.com/) + [IDRX](https://idrx.co/) stablecoin |

---

## Grant Package

- [Agentic Engineering Grant Application](docs/GRANT_APPLICATION_AGENTIC_ENGINEERING.md)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **pnpm** / **yarn**)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RioSudrajat/Nemesis-Protocol.git
cd Nemesis-Protocol

# 2. Navigate to the frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Build for Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
nemesis-protocol/
├── docs/                          # Protocol documentation
│   ├── NEMESIS_V2_BLUEPRINT.md    # V2 product & economics blueprint
│   ├── NEMESIS_Protocol_Pitch_EN.md
│   └── PRD.md                     # Product Requirements Document
├── frontend/                      # Next.js application
│   ├── public/                    # Static assets
│   └── src/
│       ├── app/                   # Next.js App Router
│       │   ├── (marketing)/       # Landing & public pages
│       │   ├── (depin)/           # DePIN dashboard & driver portal
│       │   ├── (fi)/              # Financing / investor platform
│       │   ├── (rwa)/             # RWA asset registry & operator portal
│       │   ├── (workshop)/        # Workshop & maintenance portal
│       │   └── (admin)/           # Admin panel
│       ├── components/            # Reusable UI components
│       │   ├── landing/           # Marketing page sections
│       │   ├── depin/             # DePIN-specific components
│       │   ├── rwa/               # RWA components
│       │   ├── layout/            # Navigation, sidebar, footer
│       │   └── ui/                # Design system primitives
│       ├── store/                 # Zustand state stores
│       ├── types/                 # TypeScript type definitions
│       ├── data/                  # Static data & mock datasets
│       ├── content/               # Centralized copy & content config
│       ├── constants/             # App-wide constants
│       ├── context/               # React context providers
│       └── lib/                   # Utility functions
└── to-do.md                       # V2 rework execution plan
```

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| **Phase 1** | Mobility Credit Pools (ride-hailing & delivery EV bikes) | 🟡 In Progress |
| **Phase 1B** | Fleet Remittance Pools (taxis, vans, shuttles, buses) | ⚪ Planned |
| **Phase 2** | Charging Yield Pools (depot chargers, fast chargers, swap stations) | ⚪ Planned |
| **Phase 3** | Energy Yield Pools (solar for EV depots, battery storage) | ⚪ Planned |
| **Phase 4** | Integrated EV Infrastructure Pools | ⚪ Planned |

---

## Contributing

We welcome contributions! If you'd like to get involved:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is proprietary. All rights reserved.

---

<p align="center">
  <sub>Built with ⚡ by the Nemesis Protocol team</sub>
</p>
