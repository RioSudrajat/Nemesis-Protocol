"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { ActivityRouteMap } from "@/components/depin/ActivityRouteMap";

type FleetMapVehicle = {
  id?: string;
  name: string;
  vin?: string;
  health: number;
  region: string;
  odometer: number;
  owner?: string;
  status?: string;
};

type FleetMapPool = {
  id: string;
  name: string;
  region: string;
  units: number;
  status: string;
  cashYield?: string;
  apy?: string;
};

interface FleetLeafletMapProps {
  vehicles?: FleetMapVehicle[];
  pools?: FleetMapPool[];
}

// Region coordinates for approximate vehicle placement
const regionCoordinates: Record<string, { lat: number; lng: number }> = {
  Jakarta: { lat: -6.2, lng: 106.845 },
  Tangerang: { lat: -6.302, lng: 106.652 },
  Bandung: { lat: -6.917, lng: 107.619 },
  Surabaya: { lat: -7.291, lng: 112.738 },
  Semarang: { lat: -6.991, lng: 110.423 },
  Medan: { lat: 3.595, lng: 98.672 },
  Other: { lat: -2.5, lng: 118.0 },
};

function getHealthColor(health: number): string {
  if (health >= 70) return "#86EFAC";
  if (health >= 50) return "#FCD34D";
  return "#FCA5A5";
}

function createVehicleMarkerIcon(health: number) {
  const color = getHealthColor(health);
  return L.divIcon({
    className: "custom-fleet-marker",
    html: `<div style="
      width: 14px; height: 14px; border-radius: 50%;
      background: ${color};
      border: 2px solid ${color}80;
      box-shadow: 0 0 10px ${color}60, 0 0 20px ${color}20;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

export default function FleetLeafletMap({ vehicles, pools }: FleetLeafletMapProps) {
  const [activeRouteVehicle, setActiveRouteVehicle] = useState<FleetMapVehicle | null>(null);
  const items = pools || vehicles || [];
  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(14,14,26,0.95) !important;
          border: 1px solid rgba(94, 234, 212,0.3) !important;
          border-radius: 12px !important;
          color: #fff !important;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip {
          background: rgba(14,14,26,0.95) !important;
          border: 1px solid rgba(94, 234, 212,0.3) !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255,255,255,0.5) !important;
          font-size: 18px !important;
        }
        .leaflet-popup-close-button:hover { color: #fff !important; }
        .leaflet-popup-content { margin: 12px 16px !important; }
        .custom-fleet-marker { background: none !important; border: none !important; }
        .leaflet-container { background: #0E0E1A !important; }
        .leaflet-control-attribution {
          background: rgba(14,14,26,0.8) !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: rgba(94, 234, 212,0.5) !important; }
        .leaflet-control-zoom a {
          background: rgba(14,14,26,0.9) !important;
          color: rgba(255,255,255,0.7) !important;
          border-color: rgba(94, 234, 212,0.2) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(94, 234, 212,0.2) !important;
          color: #fff !important;
        }
      `}</style>
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        minZoom={3}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          noWrap={true}
        />
        {items.map((item, idx) => {
          const coords = regionCoordinates[item.region] || regionCoordinates.Other;
          // Offset slightly so vehicles in the same region don't overlap
          const offset = idx * 0.015;
          const isPoolItem = "units" in item;
          const markerKey = isPoolItem ? item.id : item.vin ?? item.id ?? item.name;
          const health = isPoolItem ? (item.status === 'Active' ? 100 : 60) : item.health;
          return (
            <Marker
              key={`${markerKey}-${idx}`}
              position={[coords.lat + offset * Math.sin(idx), coords.lng + offset * Math.cos(idx)]}
              icon={createVehicleMarkerIcon(health)}
            >
              <Popup>
                {isPoolItem ? (
                  <div style={{ minWidth: 200 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.name}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: 8 }}>{item.id}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Status</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.status === 'Active' ? "#86EFAC" : "#FCD34D" }}>{item.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Region</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.region}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>EV Units</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.units}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Cash Yield</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--solana-purple)" }}>{item.cashYield ?? item.apy}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ minWidth: 200 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.name}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: 8 }}>{item.vin}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Health Score</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: getHealthColor(item.health) }}>{item.health}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Region</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.region}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Mileage</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.odometer.toLocaleString("id-ID")} km</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Owner</span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--solana-purple)" }}>{(item.owner ?? "operator").slice(0, 8)}...</span>
                    </div>
                    
                    <button
                      onClick={() => setActiveRouteVehicle(item)}
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        background: "rgba(20, 184, 166, 0.1)",
                        border: "1px solid rgba(20, 184, 166, 0.3)",
                        borderRadius: "8px",
                        color: "#14B8A6",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "4px"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(20, 184, 166, 0.2)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(20, 184, 166, 0.1)";
                      }}
                    >
                      View Daily Route Log
                    </button>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {activeRouteVehicle && (
        <ActivityRouteMap 
          isModal={true} 
          onClose={() => setActiveRouteVehicle(null)} 
        />
      )}
    </>
  );
}
