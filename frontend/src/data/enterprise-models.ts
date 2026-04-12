// Shared enterprise constants (MVP / mock)
// Single source of truth for the logged-in enterprise identity and
// the catalog of 3D models the enterprise "owns".

export const ENTERPRISE_NAME = "PT Astra Manufacturing";
export const ENTERPRISE_ROLE = "Genesis Minter";

export type EnterpriseModelKey = "avanza" | "bmw_m4" | "beat" | "harley" | "supra";

export interface EnterpriseModel {
  id: string;
  name: string;
  category: "car" | "motorcycle" | "truck";
  modelKey: EnterpriseModelKey;
  fileName: string;
  fileSize: string;
  blobUrl: string;
  uploadedAt: string;
  status: "active" | "draft";
}

// The 5 seeded 3D models the enterprise already owns.
// These mirror the vehicles the workshop digital-twin viewer can render.
export const SEED_ENTERPRISE_MODELS: EnterpriseModel[] = [
  {
    id: "mdl-avanza",
    name: "Toyota Avanza 2025",
    category: "car",
    modelKey: "avanza",
    fileName: "avanza.glb",
    fileSize: "12.4 MB",
    blobUrl: "/models/avanza.glb",
    uploadedAt: "2026-01-08",
    status: "active",
  },
  {
    id: "mdl-bmw-m4",
    name: "BMW M4 G82 2025",
    category: "car",
    modelKey: "bmw_m4",
    fileName: "bmw_m4_g82.glb",
    fileSize: "22.1 MB",
    blobUrl: "/models/bmw_m4_g82.glb",
    uploadedAt: "2026-01-15",
    status: "active",
  },
  {
    id: "mdl-beat",
    name: "Honda Beat 2024",
    category: "motorcycle",
    modelKey: "beat",
    fileName: "honda_beat.glb",
    fileSize: "8.9 MB",
    blobUrl: "/models/honda_beat.glb",
    uploadedAt: "2026-01-20",
    status: "active",
  },
  {
    id: "mdl-harley",
    name: "Harley-Davidson Sportster S",
    category: "motorcycle",
    modelKey: "harley",
    fileName: "harley_sportster_s.glb",
    fileSize: "14.7 MB",
    blobUrl: "/models/harley_sportster_s.glb",
    uploadedAt: "2026-02-02",
    status: "active",
  },
  {
    id: "mdl-supra",
    name: "Toyota Supra Veilside A80",
    category: "car",
    modelKey: "supra",
    fileName: "supra_veilside.glb",
    fileSize: "78.2 MB",
    blobUrl: "/models/supra_veilside.glb",
    uploadedAt: "2026-02-14",
    status: "active",
  },
];

export const ENTERPRISE_MODEL_LABELS: Record<EnterpriseModelKey, string> = {
  avanza: "Toyota Avanza",
  bmw_m4: "BMW M4 G82",
  beat: "Honda Beat",
  harley: "Harley-Davidson Sportster S",
  supra: "Toyota Supra Veilside",
};

export const PART_CATEGORIES = [
  "Exterior",
  "Interior",
  "Engine",
  "Drivetrain",
  "Brakes",
  "Wheels",
  "Suspension",
] as const;

export type PartCategory = (typeof PART_CATEGORIES)[number];

export const CATEGORY_COLORS: Record<PartCategory, string> = {
  Exterior: "#5EEAD4",
  Interior: "#2DD4BF",
  Engine: "#14B8A6",
  Drivetrain: "#0D9488",
  Brakes: "#0F766E",
  Wheels: "#99F6E4",
  Suspension: "#67E8F9",
};
