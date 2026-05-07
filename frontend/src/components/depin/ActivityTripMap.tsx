"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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
import { MAPLIBRE_DARK_STYLE } from "@/components/maps/mapStyles";

interface ActivityTripMapProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function ActivityTripMap({ onClose, isModal = false }: ActivityTripMapProps) {
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
          <TripMapPreview />
          
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

function TripMapPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const routePath: [number, number][] = [
      [106.81, -6.225],
      [106.812, -6.23],
      [106.815, -6.235],
      [106.812, -6.242],
      [106.814, -6.25],
      [106.818, -6.255],
      [106.816, -6.262],
    ];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAPLIBRE_DARK_STYLE,
      center: [106.814, -6.242],
      zoom: 13.8,
      attributionControl: false,
      interactive: false,
      pitchWithRotate: false,
    });

    map.on("load", () => {
      map.addSource("activity-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: routePath },
        },
      });

      map.addLayer({
        id: "activity-route-glow",
        type: "line",
        source: "activity-route",
        paint: {
          "line-color": "#14B8A6",
          "line-width": 10,
          "line-opacity": 0.24,
          "line-blur": 8,
        },
      });

      map.addLayer({
        id: "activity-route-line",
        type: "line",
        source: "activity-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#5EEAD4",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      routePath.forEach((point, index) => {
        if (index !== 0 && index !== routePath.length - 1) return;
        const marker = document.createElement("div");
        marker.style.cssText = `
          width: ${index === 0 ? 12 : 15}px;
          height: ${index === 0 ? 12 : 15}px;
          border-radius: 999px;
          background: ${index === 0 ? "#5EEAD4" : "#FCD34D"};
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 18px rgba(94,234,212,0.5);
        `;
        new maplibregl.Marker({ element: marker }).setLngLat(point).addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={containerRef} className="h-full w-full bg-zinc-900" />
      <style jsx global>{`
        .maplibregl-ctrl-logo {
          display: none !important;
        }
      `}</style>
    </>
  );
}
