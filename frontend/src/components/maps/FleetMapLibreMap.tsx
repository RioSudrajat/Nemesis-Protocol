"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ActivityRouteMap } from "@/components/depin/ActivityRouteMap";
import { getCoordinateForRegion, getJavaFleetCoordinate } from "@/lib/javaFleetCoordinates";
import { JAVA_CENTER, MAPLIBRE_DARK_STYLE } from "@/components/maps/mapStyles";

export type FleetMapVehicle = {
  id?: string;
  name: string;
  vin?: string;
  health: number;
  region?: string;
  odometer: number;
  owner?: string;
  status?: string;
};

export type FleetMapPool = {
  id: string;
  name: string;
  region?: string;
  units: number;
  status: string;
  cashYield?: string;
  apy?: string;
};

interface FleetMapLibreMapProps {
  vehicles?: FleetMapVehicle[];
  pools?: FleetMapPool[];
}

type MapItem =
  | ({ kind: "vehicle"; coordinates: [number, number]; zone: string } & FleetMapVehicle)
  | ({ kind: "pool"; coordinates: [number, number]; zone: string } & FleetMapPool);

function getHealthColor(health: number): string {
  if (health >= 70) return "#86EFAC";
  if (health >= 50) return "#FCD34D";
  return "#FCA5A5";
}

function getStatusColor(item: MapItem) {
  if (item.kind === "pool") return item.status === "Active" ? "#86EFAC" : "#FCD34D";
  const status = item.status?.toLowerCase() ?? "";
  if (status.includes("maintenance")) return "#FCD34D";
  if (status.includes("idle")) return "#A1A1AA";
  if (status.includes("offline") || status.includes("inactive")) return "#FCA5A5";
  return getHealthColor(item.health);
}

function markerHtml(color: string, large = false) {
  const size = large ? 18 : 14;
  return `
    <div class="fleet-maplibre-marker" style="
      width:${size}px;height:${size}px;border-radius:999px;
      background:${color};border:2px solid ${color}88;
      box-shadow:0 0 10px ${color}70, 0 0 24px ${color}30;
    "></div>
  `;
}

function popupHtml(item: MapItem) {
  if (item.kind === "pool") {
    return `
      <div class="fleet-popup">
        <p class="fleet-popup-title">${item.name}</p>
        <p class="fleet-popup-code">${item.id}</p>
        <div class="fleet-popup-row"><span>Status</span><strong style="color:${getStatusColor(item)}">${item.status}</strong></div>
        <div class="fleet-popup-row"><span>Region</span><strong>${item.region ?? item.zone}</strong></div>
        <div class="fleet-popup-row"><span>EV Units</span><strong>${item.units}</strong></div>
        <div class="fleet-popup-row"><span>Cash Yield</span><strong>${item.cashYield ?? item.apy ?? "-"}</strong></div>
      </div>
    `;
  }

  return `
    <div class="fleet-popup">
      <p class="fleet-popup-title">${item.name}</p>
      <p class="fleet-popup-code">${item.vin ?? item.id ?? ""}</p>
      <div class="fleet-popup-row"><span>Health Score</span><strong style="color:${getHealthColor(item.health)}">${item.health}</strong></div>
      <div class="fleet-popup-row"><span>Zone</span><strong>${item.zone}</strong></div>
      <div class="fleet-popup-row"><span>Mileage</span><strong>${item.odometer.toLocaleString("id-ID")} km</strong></div>
      <div class="fleet-popup-row"><span>Owner</span><strong>${(item.owner ?? "operator").slice(0, 12)}</strong></div>
      <button class="fleet-popup-button" data-route-id="${item.id ?? item.vin ?? item.name}">View Daily Route Log</button>
    </div>
  `;
}

export default function FleetMapLibreMap({ vehicles, pools }: FleetMapLibreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRefs = useRef<maplibregl.Marker[]>([]);
  const popupButtonCleanups = useRef<(() => void)[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRouteVehicle, setActiveRouteVehicle] = useState<FleetMapVehicle | null>(null);

  const items = useMemo<MapItem[]>(() => {
    if (pools) {
      return pools.map((pool) => {
        const coordinate = getCoordinateForRegion(pool.region ?? "Jakarta", pool.id);
        return {
          ...pool,
          kind: "pool" as const,
          coordinates: [coordinate.lng, coordinate.lat] as [number, number],
          zone: coordinate.cluster.label,
        };
      });
    }

    return (vehicles ?? []).map((vehicle) => {
      const coordinate = getJavaFleetCoordinate(vehicle.id ?? vehicle.vin ?? vehicle.name, vehicle.region);
      return {
        ...vehicle,
        kind: "vehicle" as const,
        coordinates: [coordinate.lng, coordinate.lat] as [number, number],
        zone: coordinate.cluster.label,
      };
    });
  }, [pools, vehicles]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAPLIBRE_DARK_STYLE,
      center: JAVA_CENTER,
      zoom: 6,
      minZoom: 4,
      maxZoom: 16,
      attributionControl: false,
      pitchWithRotate: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-left");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;

    return () => {
      popupButtonCleanups.current.forEach((cleanup) => cleanup());
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    popupButtonCleanups.current.forEach((cleanup) => cleanup());
    popupButtonCleanups.current = [];
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    items.forEach((item) => {
      const color = getStatusColor(item);
      const element = document.createElement("div");
      element.innerHTML = markerHtml(color, item.kind === "pool");
      const popup = new maplibregl.Popup({ offset: 16, closeButton: true, className: "fleet-maplibre-popup" })
        .setHTML(popupHtml(item));

      popup.on("open", () => {
        if (item.kind !== "vehicle") return;
        const routeButton = popup.getElement()?.querySelector<HTMLButtonElement>("[data-route-id]");
        if (!routeButton) return;
        const handleClick = () => setActiveRouteVehicle(item);
        routeButton.addEventListener("click", handleClick);
        popupButtonCleanups.current.push(() => routeButton.removeEventListener("click", handleClick));
      });

      const marker = new maplibregl.Marker({ element })
        .setLngLat(item.coordinates)
        .setPopup(popup)
        .addTo(map);
      markerRefs.current.push(marker);
    });

    if (items.length) {
      const bounds = new maplibregl.LngLatBounds();
      items.forEach((item) => bounds.extend(item.coordinates));
      map.fitBounds(bounds, { padding: 54, maxZoom: pools ? 7 : 8.8, duration: 650 });
    }
  }, [items, mapLoaded, pools]);

  return (
    <>
      <div ref={mapContainerRef} className="h-full w-full" style={{ background: "#030404" }} />
      <style jsx global>{`
        .fleet-maplibre-marker {
          transition: transform 160ms ease, filter 160ms ease;
        }
        .fleet-maplibre-marker:hover {
          transform: scale(1.32);
          filter: brightness(1.12);
        }
        .fleet-maplibre-popup .maplibregl-popup-content {
          background: rgba(5, 6, 6, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: #fff;
          padding: 14px 16px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.58);
        }
        .fleet-maplibre-popup .maplibregl-popup-tip {
          border-top-color: rgba(5, 6, 6, 0.96);
          border-bottom-color: rgba(5, 6, 6, 0.96);
        }
        .fleet-maplibre-popup .maplibregl-popup-close-button {
          color: rgba(255, 255, 255, 0.5);
          font-size: 18px;
          padding: 5px 7px;
        }
        .fleet-popup {
          min-width: 200px;
          font-family: var(--font-plus-jakarta, sans-serif);
        }
        .fleet-popup-title {
          margin: 0 18px 2px 0;
          font-size: 14px;
          font-weight: 800;
        }
        .fleet-popup-code {
          margin: 0 0 9px;
          color: rgba(255, 255, 255, 0.42);
          font-family: monospace;
          font-size: 10px;
        }
        .fleet-popup-row {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 5px;
          font-size: 11px;
        }
        .fleet-popup-row span {
          color: rgba(255, 255, 255, 0.48);
        }
        .fleet-popup-row strong {
          color: rgba(255, 255, 255, 0.82);
          font-size: 12px;
          text-align: right;
        }
        .fleet-popup-button {
          margin-top: 10px;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          color: #ddfdf8;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          padding: 8px 0;
        }
        .fleet-popup-button:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .maplibregl-ctrl-attrib {
          background: rgba(5, 6, 6, 0.72) !important;
          color: rgba(255, 255, 255, 0.28) !important;
          font-size: 9px !important;
        }
        .maplibregl-ctrl-attrib a {
          color: rgba(221, 253, 248, 0.52) !important;
        }
        .maplibregl-ctrl-logo {
          display: none !important;
        }
      `}</style>

      {activeRouteVehicle && (
        <ActivityRouteMap
          isModal={true}
          onClose={() => setActiveRouteVehicle(null)}
        />
      )}
    </>
  );
}
