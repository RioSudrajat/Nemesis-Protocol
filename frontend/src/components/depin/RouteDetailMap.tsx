"use client";

import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RoutePoint } from "@/store/driverStore";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

interface RouteDetailMapProps {
  route: RoutePoint[];
}

export function RouteDetailMap({ route }: RouteDetailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || route.length === 0) return;

    // Calculate bounds
    let minLat = route[0].lat, maxLat = route[0].lat;
    let minLng = route[0].lng, maxLng = route[0].lng;
    for (const p of route) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
      zoom: 13,
      attributionControl: false,
      pitchWithRotate: false,
      interactive: true,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      setLoaded(true);

      // Fit bounds with padding
      map.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 60, maxZoom: 15 }
      );

      const coordinates = route.map((p) => [p.lng, p.lat]);

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });

      // Glow
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        paint: { "line-color": "#14B8A6", "line-width": 10, "line-opacity": 0.2, "line-blur": 8 },
      });

      // Line
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: { "line-color": "#5EEAD4", "line-width": 3.5, "line-opacity": 0.9 },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      // Start marker
      const startEl = document.createElement("div");
      startEl.style.cssText = "width:12px;height:12px;background:#22C55E;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px rgba(34,197,94,0.6)";
      new maplibregl.Marker({ element: startEl }).setLngLat([coordinates[0][0], coordinates[0][1]]).addTo(map);

      // End marker
      const endEl = document.createElement("div");
      endEl.style.cssText = "width:12px;height:12px;background:#EF4444;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px rgba(239,68,68,0.6)";
      new maplibregl.Marker({ element: endEl }).setLngLat([coordinates[coordinates.length - 1][0], coordinates[coordinates.length - 1][1]]).addTo(map);
    });

    return () => map.remove();
  }, [route]);

  return <div ref={containerRef} className="w-full h-full" style={{ background: "#0a0e17" }} />;
}
