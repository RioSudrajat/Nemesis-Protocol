export const PROTOCOL_PROOFS = [
  {
    id: "asset",
    label: "Proof of Asset",
    description: "Asset identity, operator mapping, deployment status, and financing pool eligibility.",
  },
  {
    id: "activity",
    label: "Proof of Activity",
    description: "GPS route logs, km/day, active usage hours, route coverage, and movement consistency.",
  },
  {
    id: "revenue",
    label: "Proof of Revenue",
    description: "Expected collection, actual payment, lateness, arrears, and distribution readiness.",
  },
  {
    id: "maintenance",
    label: "Proof of Maintenance",
    description: "Service due dates, completed work, reserve usage, workshop proof, and return-to-service status.",
  },
] as const;

export type ProtocolProofId = (typeof PROTOCOL_PROOFS)[number]["id"];
