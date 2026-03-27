"use client";

import SharedDigitalTwinViewer from "@/components/3d/SharedDigitalTwinViewer";
import { useSearchParams } from "next/navigation";
import { vehicleData, VehicleKey } from "@/context/ActiveVehicleContext";
import { Suspense } from "react";

function ViewerContent() {
  const searchParams = useSearchParams();
  const vin = searchParams.get("vin");
  
  let initialVehicle: VehicleKey | null = null;
  if (vin) {
    const entry = Object.entries(vehicleData).find(([_, v]) => v.vin === vin);
    if (entry) initialVehicle = entry[0] as VehicleKey;
  }
  
  return <SharedDigitalTwinViewer mode="mechanic" initialVehicle={initialVehicle} />;
}

export default function WorkshopViewerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading 3D Viewer...</div>}>
      <ViewerContent />
    </Suspense>
  );
}
