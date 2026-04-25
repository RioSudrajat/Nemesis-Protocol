"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

type GlobeRenderState = {
  phi: number;
  width: number;
  height: number;
};

type GlobeOptionsWithOnRender = Parameters<typeof createGlobe>[1] & {
  onRender: (state: GlobeRenderState) => void;
};

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    // Resize handling for responsive globe
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(
      canvasRef.current!,
      {
        devicePixelRatio: 2,
        width: width * 2 || 600 * 2,
        height: width * 2 || 600 * 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.15, 0.15, 0.15],
        markerColor: [0.08, 0.72, 0.65], // #14b8a6 (Teal-500)
        glowColor: [0.15, 0.15, 0.15],
        markers: [
          { location: [-6.2088, 106.8456], size: 0.1 }, // Jakarta
          { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        ],
        // cobe supports onRender at runtime, but its published .d.ts omits it.
        onRender: (state) => {
          state.phi = phi;
          phi += 0.005;
          state.width = width * 2;
          state.height = width * 2;
        },
      } as GlobeOptionsWithOnRender,
    );

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={`w-full relative aspect-square flex items-center justify-center ${className || ""}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0.9,
        }}
      />
    </div>
  );
}
