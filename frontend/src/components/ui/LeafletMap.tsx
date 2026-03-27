"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Workshop } from "@/context/BookingContext";
import Link from "next/link";
import { Star, CheckCircle2, ShieldCheck } from "lucide-react";

interface LeafletMapProps {
  workshops: Workshop[];
}

function createMarkerIcon(verified: boolean) {
  const color = verified ? "#14F195" : "#FACC15";
  return L.divIcon({
    className: "custom-workshop-marker",
    html: `<div style="
      width: 16px; height: 16px; border-radius: 50%;
      background: ${color};
      border: 2px solid ${verified ? "rgba(20,241,149,0.5)" : "rgba(250,204,21,0.5)"};
      box-shadow: 0 0 12px ${verified ? "rgba(20,241,149,0.5)" : "rgba(250,204,21,0.5)"}, 0 0 24px ${verified ? "rgba(20,241,149,0.2)" : "rgba(250,204,21,0.2)"};
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });
}

export default function LeafletMap({ workshops }: LeafletMapProps) {
  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(14,14,26,0.95) !important;
          border: 1px solid rgba(153,69,255,0.3) !important;
          border-radius: 12px !important;
          color: #fff !important;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip {
          background: rgba(14,14,26,0.95) !important;
          border: 1px solid rgba(153,69,255,0.3) !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255,255,255,0.5) !important;
          font-size: 18px !important;
        }
        .leaflet-popup-close-button:hover {
          color: #fff !important;
        }
        .leaflet-popup-content {
          margin: 12px 16px !important;
        }
        .custom-workshop-marker {
          background: none !important;
          border: none !important;
        }
        .leaflet-container {
          background: #0E0E1A !important;
        }
        .leaflet-control-attribution {
          background: rgba(14,14,26,0.8) !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(153,69,255,0.5) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(14,14,26,0.9) !important;
          color: rgba(255,255,255,0.7) !important;
          border-color: rgba(153,69,255,0.2) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(153,69,255,0.2) !important;
          color: #fff !important;
        }
      `}</style>
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {workshops.map((ws) => (
          <Marker
            key={ws.id}
            position={[ws.coordinates.lat, ws.coordinates.lng]}
            icon={createMarkerIcon(ws.verified)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{ws.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                  <Star style={{ width: 12, height: 12, color: "#FACC15", fill: "#FACC15" }} />
                  <span style={{ fontSize: 12, color: "#FACC15", fontWeight: 600 }}>{ws.rating}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>({ws.totalReviews} review)</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {ws.badges.map((badge) => (
                    <span
                      key={badge}
                      style={{
                        fontSize: 9,
                        padding: "2px 6px",
                        borderRadius: 99,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        background: badge === "Pending KYC" ? "rgba(250,204,21,0.15)" : "rgba(20,241,149,0.15)",
                        color: badge === "Pending KYC" ? "#FACC15" : "#14F195",
                        border: `1px solid ${badge === "Pending KYC" ? "rgba(250,204,21,0.25)" : "rgba(20,241,149,0.25)"}`,
                      }}
                    >
                      {badge.includes("Verified") && <CheckCircle2 style={{ width: 9, height: 9 }} />}
                      {badge.includes("OEM") && <ShieldCheck style={{ width: 9, height: 9 }} />}
                      {badge}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{ws.specialization}</p>
                <Link
                  href={`/dapp/book/${ws.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #9945FF, #14F195)",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  Lihat Profil
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
