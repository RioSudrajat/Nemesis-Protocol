"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Navigation, 
  Clock, 
  Gauge, 
  Zap, 
  Battery, 
  Settings, 
  Activity, 
  ShieldCheck, 
  X 
} from "lucide-react";
import { createPortal } from "react-dom";
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface ActivityTripMapProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function ActivityTripMap({ onClose, isModal = false }: ActivityTripMapProps) {
  const [mounted] = useState(() => typeof window !== "undefined");

  // Mock daily route segment in Jakarta
  const routePath: [number, number][] = [
    [-6.225, 106.81],
    [-6.230, 106.812],
    [-6.235, 106.815],
    [-6.242, 106.812],
    [-6.250, 106.814],
    [-6.255, 106.818],
    [-6.262, 106.816]
  ];

  if (!mounted) return <div className="min-h-[500px] w-full bg-zinc-900 animate-pulse sm:rounded-3xl" />;

  const Wrapper = isModal ? "div" : "div";
  const wrapperClass = isModal 
    ? "fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-6"
    : "relative w-full h-[800px] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800";

  const containerClass = isModal
    ? "relative w-full h-[95vh] sm:h-[800px] max-w-[480px] overflow-hidden bg-[#050606] sm:rounded-3xl border border-white/[0.09] shadow-[0_30px_120px_rgba(0,0,0,0.64)] flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95"
    : "w-full h-full flex flex-col bg-[#050606]";

  const content = (
    <Wrapper className={wrapperClass}>
      <div className={containerClass}>
        {isModal && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[1000] p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Map Area */}
        <div className="relative h-[45%] w-full shrink-0">
          <MapContainer
            center={[-6.242, 106.814]}
            zoom={14}
            zoomControl={false}
            style={{ width: "100%", height: "100%", background: "#18181b" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Polyline positions={routePath} color="#5EEAD4" weight={5} opacity={0.86} />
          </MapContainer>
          
          {/* Fading overlay to blend map into the dark route sheet */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050606] to-transparent z-[500]" />
        </div>

        {/* Route details sheet */}
        <div className="z-[1000] flex-1 overflow-y-auto bg-[#050606] p-6 [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin]">
          
          <div className="mb-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">Proof of Activity</p>
            <h2
              className="text-2xl font-semibold tracking-[-0.045em] text-white"
              style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
            >
              Daily Route Log
            </h2>
            <p className="mt-1 text-sm font-medium text-white/42">Monday, 20 Apr 2026 - 1:39 PM</p>
          </div>

          <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-10">
            <div className="flex flex-col">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-teal-100/78"><Navigation size={14} /> Distance</span>
              <span className="text-2xl font-semibold tracking-tighter text-white">14.7 <span className="text-sm font-bold text-white/42">km</span></span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-amber-100/78"><Clock size={14} /> Active Time</span>
              <span className="text-2xl font-semibold tracking-tighter text-white">42<span className="text-sm font-bold text-white/42">m</span> 15<span className="text-sm font-bold text-white/42">s</span></span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-rose-100/78"><Gauge size={14} /> Route Cover</span>
              <span className="text-2xl font-semibold tracking-tighter text-white">92<span className="text-sm font-bold text-white/42">%</span></span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-white/42"><Activity size={14} /> Segments</span>
              <span className="text-2xl font-semibold tracking-tighter text-white">7</span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-white/42"><Zap size={14} /> Energy</span>
              <span className="text-2xl font-semibold tracking-tighter text-white">1.8 <span className="text-sm font-bold text-white/42">kWh</span></span>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-teal-100/78"><Battery size={14} /> Hash</span>
              <span className="text-2xl font-semibold tracking-tighter text-teal-100">OK</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 border-b border-white/[0.07] pb-2 text-xs font-bold uppercase tracking-wider text-white/42">Proof of Activity + Maintenance Signals</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center group">
                <span className="flex items-center gap-2.5 text-sm font-semibold text-white/70"><div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-1.5 transition-colors group-hover:bg-white/[0.06]"><Battery size={16} className="text-white/54"/></div> Battery Health</span>
                <span className="rounded-md border border-rose-200/15 bg-rose-200/10 px-2 py-0.5 text-sm font-bold text-rose-200">-0.01%</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="flex items-center gap-2.5 text-sm font-semibold text-white/70"><div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-1.5 transition-colors group-hover:bg-white/[0.06]"><Settings size={16} className="text-white/54"/></div> Tire Tread</span>
                <span className="rounded-md border border-rose-200/15 bg-rose-200/10 px-2 py-0.5 text-sm font-bold text-rose-200">-0.12%</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="flex items-center gap-2.5 text-sm font-semibold text-white/70"><div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-1.5 transition-colors group-hover:bg-white/[0.06]"><ShieldCheck size={16} className="text-white/54"/></div> Brake Pads</span>
                <span className="rounded-md border border-emerald-200/15 bg-emerald-200/10 px-2 py-0.5 text-sm font-bold text-emerald-200">Minimal (Regen)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );

  if (isModal) {
    // Render in portal so it breaks out of any overflow:hidden or transform containers
    return createPortal(content, document.body);
  }

  return content;
}
