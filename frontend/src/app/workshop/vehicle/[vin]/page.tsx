"use client";

import { useState, use } from "react";
import { Car, Shield, Droplets, ShieldCheck, Gauge, ArrowLeft, Box } from "lucide-react";
import Link from "next/link";
import { SharedServiceCard, ServiceEvent } from "@/components/ui/SharedServiceCard";
import { vehicleData } from "@/context/ActiveVehicleContext";

const timelineEvents: Record<string, ServiceEvent[]> = {
  MHKA1BA1JFK000001: [
    { id: 2, status: "ANCHORED", date: "2026-02-10", type: "Oil Change", category: "Fluids", icon: Droplets, mechanic: "Pak Hendra", workshop: "Bengkel Hendra Motor", rating: 4.8, mileage: "34,521 km", parts: [
      { name: "Engine Oil 5W-30 (4L)", partNumber: "08880-83264", isOem: true, manufacturer: "Toyota Motor Corp", priceIDR: 380000 },
      { name: "Oil Filter", partNumber: "90915-YZZD4", isOem: true, manufacturer: "Denso Corp", priceIDR: 45000 },
    ], serviceCost: 50000, gasFee: 100, costIDR: 475100, costUSDC: 30, costNOC: 48, costStr: "Rp 475,100", txSig: "4xK9...mF7q", healthBefore: 45, healthAfter: 95, notes: "Filter changed. No leaks detected.", images: [] },
    { id: 3, status: "ANCHORED", date: "2026-01-15", type: "Brake Pad Replacement", category: "Brakes", icon: ShieldCheck, mechanic: "Workshop Maju Jaya", workshop: "PT Maju Jaya Auto", rating: 4.5, mileage: "31,200 km", parts: [
      { name: "Front Brake Pad Set", partNumber: "04465-BZ010", isOem: true, manufacturer: "Aisin Corp", priceIDR: 450000 },
      { name: "Brake Disc Rotor FL", partNumber: "43512-BZ130", isOem: true, manufacturer: "Toyota Motor Corp", priceIDR: 550000 },
    ], serviceCost: 150000, gasFee: 100, costIDR: 1150100, costUSDC: 72, costNOC: 115, costStr: "Rp 1,150,100", txSig: "7hR2...pK4s", healthBefore: 28, healthAfter: 100, notes: "Front pads replaced. Rotors look fine but should be checked next service.", images: [] },
    { id: 4, status: "ANCHORED", date: "2025-11-20", type: "Full Inspection", category: "Inspection", icon: Gauge, mechanic: "Dealer Toyota BSD", workshop: "Toyota Astra Motor BSD", rating: 4.9, mileage: "28,000 km", parts: [], serviceCost: 0, gasFee: 100, costIDR: 100, costUSDC: 0, costNOC: 0, costStr: "Rp 0 (Warranty)", txSig: "2mN5...xJ8w", healthBefore: 82, healthAfter: 87, notes: "Standard 6-month checkup. All systems optimal.", images: [] },
  ],
  WBA43AZ0X0CH00001: [
    { id: 5, status: "ANCHORED", date: "2026-03-01", type: "Suspension Check", category: "Full Service", icon: Gauge, mechanic: "EuroHaus M Performance", workshop: "EuroHaus ID", rating: 4.9, mileage: "12,400 km", parts: [
      { name: "Alignment Calibration Kit", partNumber: "31-12-6-867-848", isOem: true, manufacturer: "BMW AG", priceIDR: 350000 },
    ], serviceCost: 500000, gasFee: 100, costIDR: 850100, costUSDC: 53, costNOC: 85, costStr: "Rp 850,100", txSig: "1B3c...A5f9", healthBefore: 88, healthAfter: 98, notes: "Suspension aligned to factory M specification.", images: [] },
  ],
  MH1JFZ110K000042: [
    { id: 6, status: "ANCHORED", date: "2026-01-05", type: "CVT & Roller Check", category: "Full Service", icon: Gauge, mechanic: "Ahass Motor", workshop: "PT Nusantara Sakti", rating: 4.5, mileage: "14,200 km", parts: [
      { name: "CVT Grease", partNumber: "08C30-K59-600ML", isOem: true, manufacturer: "Honda Motor Co", priceIDR: 35000 },
    ], serviceCost: 40000, gasFee: 100, costIDR: 75100, costUSDC: 5, costNOC: 8, costStr: "Rp 75,100", txSig: "P89q...21Wf", healthBefore: 85, healthAfter: 95, notes: "Roller and CVT cleaned.", images: [] },
  ],
  HD1ME23145K998212: [
    { id: 7, status: "ANCHORED", date: "2025-12-20", type: "Primary Chain Adj", category: "Full Service", icon: Gauge, mechanic: "Mabua Custom", workshop: "Mabua HD", rating: 5.0, mileage: "8,900 km", parts: [
      { name: "Primary Chaincase Fluid", partNumber: "62600025", isOem: true, manufacturer: "Harley-Davidson Inc", priceIDR: 280000 },
    ], serviceCost: 350000, gasFee: 100, costIDR: 630100, costUSDC: 39, costNOC: 63, costStr: "Rp 630,100", txSig: "X1oP...o99K", healthBefore: 90, healthAfter: 99, notes: "Tension adjusted.", images: [] },
  ]
};

export default function WorkshopVehicleProfile({ params }: { params: Promise<{ vin: string }> }) {
  const { vin } = use(params);
  const currVehicle = Object.values(vehicleData).find(v => v.vin === vin) || vehicleData.avanza;
  const [data] = useState(timelineEvents[vin] || timelineEvents[vehicleData.avanza.vin]);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/workshop/queue" className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="page-header">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Car className="w-7 h-7 text-purple-400" />
            Vehicle Profile
          </h1>
          <p className="text-sm mt-1 text-slate-400">Review past service logs to assist your diagnosis</p>
        </div>
        
        <Link href={`/workshop/viewer?vin=${currVehicle.vin}`} className="glow-btn-outline px-5 py-2.5 text-sm flex items-center gap-2" style={{ borderColor: 'var(--solana-cyan)', color: 'var(--solana-cyan)' }}>
          <Box className="w-4 h-4" /> View 3D Digital Twin
        </Link>
      </div>

      <div className="glass-card p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1 border-b border-slate-700/50 pb-3">{currVehicle.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">VIN</p>
                <p className="font-mono text-sm">{currVehicle.vin}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Owner</p>
                <p className="font-semibold text-white">{currVehicle.owner}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Health Score</p>
                <p className="font-semibold text-lime-400">{currVehicle.health} / 100</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">License Plate</p>
                <p className="font-mono text-sm">{currVehicle.licensePlate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6">Service Timeline</h3>
      
      <div className="relative mt-8">
        <div className="absolute left-6 top-0 bottom-0 w-[2px] hidden md:block bg-gradient-to-b from-purple-500 to-green-500/0" />

        <div className="flex flex-col gap-6">
          {data.map((event) => (
            <SharedServiceCard 
              key={event.id}
              event={event}
              userRole="workshop"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
