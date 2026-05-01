export const ASSET_CLASSES = [
  {
    id: "mobility",
    label: "Mobility Assets",
    status: "Phase 1",
    description: "Ride-hailing rental bikes, delivery bikes, cargo bikes, taxis, vans, shuttles, and buses.",
    examples: ["Ride-hailing EV bikes", "Delivery EV bikes", "Cargo EV bikes", "EV taxis"],
  },
  {
    id: "charging",
    label: "Charging Assets",
    status: "Future",
    description: "Depot chargers, public fast chargers, swap stations, and corridor charging hubs.",
    examples: ["Depot chargers", "Swap stations", "Fast charging hubs"],
  },
  {
    id: "energy",
    label: "Energy Assets",
    status: "Future",
    description: "Solar for EV depots, battery storage, and exportable surplus electricity assets.",
    examples: ["Depot solar", "Battery storage", "Exportable energy"],
  },
] as const;

export type NemesisAssetClassId = (typeof ASSET_CLASSES)[number]["id"];
