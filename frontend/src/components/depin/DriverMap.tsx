"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RoutePoint } from "@/store/driverStore";

interface DriverMapProps {
  currentPosition: { lat: number; lng: number } | null;
  todayRoute: RoutePoint[];
  gpsEnabled: boolean;
}

// Dark map style — Carto GL Dark Matter (free, no API key, vector tiles)
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// Default center: Jakarta
const DEFAULT_CENTER: [number, number] = [106.845, -6.215];
const DEFAULT_ZOOM = 12;

export function DriverMap({ currentPosition, todayRoute, gpsEnabled }: DriverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: currentPosition
        ? [currentPosition.lng, currentPosition.lat]
        : DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false, // We'll add minimal attribution
      pitchWithRotate: false,
    });

    // Add minimal attribution (bottom-right, tiny)
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("load", () => {
      setIsLoaded(true);

      // Add route source
      map.addSource("today-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      // Route line — glowing teal polyline
      map.addLayer({
        id: "today-route-glow",
        type: "line",
        source: "today-route",
        paint: {
          "line-color": "#14B8A6",
          "line-width": 8,
          "line-opacity": 0.25,
          "line-blur": 6,
        },
      });

      map.addLayer({
        id: "today-route-line",
        type: "line",
        source: "today-route",
        paint: {
          "line-color": "#5EEAD4",
          "line-width": 3,
          "line-opacity": 0.9,
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update route polyline
  const updateRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    const source = map.getSource("today-route") as maplibregl.GeoJSONSource;
    if (!source) return;

    const coordinates = todayRoute.map((p) => [p.lng, p.lat]);

    source.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    });
  }, [todayRoute, isLoaded]);

  useEffect(() => {
    updateRoute();
  }, [updateRoute]);

  // Update current position marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded || !currentPosition) return;

    if (!markerRef.current) {
      // Create pulsing dot marker
      const el = document.createElement("div");
      el.className = "driver-position-marker";
      el.innerHTML = `
        <div class="driver-marker-pulse"></div>
        <div class="driver-marker-dot"></div>
      `;
      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([currentPosition.lng, currentPosition.lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([currentPosition.lng, currentPosition.lat]);
    }

    // Smooth pan to new position
    map.easeTo({
      center: [currentPosition.lng, currentPosition.lat],
      duration: 1000,
    });
  }, [currentPosition, isLoaded]);

  // Toggle marker visibility based on GPS state
  useEffect(() => {
    if (markerRef.current) {
      const el = markerRef.current.getElement();
      el.style.display = gpsEnabled ? "block" : "none";
    }
  }, [gpsEnabled]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "#0a0e17" }}
      />

      {/* Gradient fade at top for status bar blend */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,14,23,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Gradient fade at bottom for bottom sheet blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(10,14,23,0.9) 0%, transparent 100%)",
        }}
      />

      {/* Marker styles */}
      <style jsx global>{`
        .driver-position-marker {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .driver-marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #5EEAD4;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 12px rgba(94, 234, 212, 0.8);
          z-index: 2;
        }
        .driver-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: rgba(94, 234, 212, 0.3);
          border-radius: 50%;
          animation: marker-pulse 2s ease-out infinite;
          z-index: 1;
        }
        @keyframes marker-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
        /* Hide default MapLibre attribution logo */
        .maplibregl-ctrl-attrib {
          font-size: 9px !important;
          background: transparent !important;
          color: rgba(255,255,255,0.2) !important;
        }
        .maplibregl-ctrl-attrib a {
          color: rgba(255,255,255,0.3) !important;
        }
        .maplibregl-ctrl-logo {
          display: none !important;
        }
      `}</style>
    </>
  );
}
