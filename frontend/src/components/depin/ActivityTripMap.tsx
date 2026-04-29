"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock route from Sudirman to Kemang (Jakarta)
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
    ? "relative w-full h-[95vh] sm:h-[800px] max-w-[480px] bg-white sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95"
    : "w-full h-full flex flex-col bg-white";

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
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Polyline positions={routePath} color="#2563eb" weight={5} opacity={0.8} />
          </MapContainer>
          
          {/* Fading overlay to blend map into white card */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-[500]" />
        </div>

        {/* Strava-like Details Sheet */}
        <div className="flex-1 bg-white p-6 overflow-y-auto z-[1000]">
          
          <div className="mb-6">
            <h2 className="text-2xl font-black text-zinc-900 font-[family-name:var(--font-orbitron)] tracking-tight">Volt NMS-0042</h2>
            <p className="text-sm text-zinc-500 font-medium mt-1">Monday, 20 Apr 2026 - 1:39 PM</p>
          </div>

          <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-10">
            <div className="flex flex-col">
              <span className="text-blue-500 text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Navigation size={14} /> Distance</span>
              <span className="text-2xl font-black text-zinc-900 tracking-tighter">14.7 <span className="text-sm font-bold text-zinc-500">km</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-amber-500 text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={14} /> Duration</span>
              <span className="text-2xl font-black text-zinc-900 tracking-tighter">42<span className="text-sm font-bold text-zinc-500">m</span> 15<span className="text-sm font-bold text-zinc-500">s</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-rose-500 text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Gauge size={14} /> Top Spd</span>
              <span className="text-2xl font-black text-zinc-900 tracking-tighter">72 <span className="text-sm font-bold text-zinc-500">km/h</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Activity size={14} /> Avg Spd</span>
              <span className="text-2xl font-black text-zinc-900 tracking-tighter">32 <span className="text-sm font-bold text-zinc-500">km/h</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Zap size={14} /> Energy</span>
              <span className="text-2xl font-black text-zinc-900 tracking-tighter">1.8 <span className="text-sm font-bold text-zinc-500">kWh</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#14B8A6] text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Battery size={14} /> Regen</span>
              <span className="text-2xl font-black text-[#14B8A6] tracking-tighter">+4.2<span className="text-sm font-bold">%)</span></span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 border-b border-zinc-100 pb-2">EV Component Wear Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center group">
                <span className="text-sm font-semibold text-zinc-700 flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors"><Battery size={16} className="text-zinc-600"/></div> Battery Health</span>
                <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">-0.01%</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm font-semibold text-zinc-700 flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors"><Settings size={16} className="text-zinc-600"/></div> Tire Tread</span>
                <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">-0.12%</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm font-semibold text-zinc-700 flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors"><ShieldCheck size={16} className="text-zinc-600"/></div> Brake Pads</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Minimal (Regen)</span>
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
