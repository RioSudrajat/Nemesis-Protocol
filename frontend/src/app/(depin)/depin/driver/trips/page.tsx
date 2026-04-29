"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Map, Clock, Navigation } from "lucide-react";
import { ActivityTripMap } from "@/components/depin/ActivityTripMap";

export default function DriverTripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<boolean>(false);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--solana-dark)", color: "#E4E6EB" }}>
      <div className="max-w-[480px] mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <Link href="/depin/driver" className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-orbitron)]">Activity History</h1>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          <div 
            onClick={() => setSelectedTrip(true)}
            className="glass-card p-5 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#14B8A6]/5 rounded-full blur-2xl group-hover:bg-[#14B8A6]/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <p className="text-white font-bold text-lg">Sudirman - Kemang</p>
                <p className="text-xs text-gray-400">Today, 1:39 PM</p>
              </div>
              <div className="bg-[#14B8A6]/10 text-[#14B8A6] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#14B8A6]/20 uppercase tracking-wider">
                +4.2% Regen
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5 relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Navigation size={12}/> Dist</span>
                <span className="text-sm font-semibold text-white">14.7 km</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Clock size={12}/> Time</span>
                <span className="text-sm font-semibold text-white">42m 15s</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#14B8A6] uppercase font-bold flex items-center gap-1"><Map size={12}/> Map</span>
                <span className="text-sm font-semibold text-white group-hover:text-[#14B8A6] transition-colors">View Route →</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl opacity-60 border border-white/5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white font-bold text-lg">Kemang - SCBD</p>
                <p className="text-xs text-gray-400">Yesterday, 9:15 AM</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Navigation size={12}/> Dist</span>
                <span className="text-sm font-semibold text-white">8.5 km</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Clock size={12}/> Time</span>
                <span className="text-sm font-semibold text-white">25m 30s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {selectedTrip && (
        <ActivityTripMap 
          isModal={true} 
          onClose={() => setSelectedTrip(false)} 
        />
      )}
    </div>
  );
}
