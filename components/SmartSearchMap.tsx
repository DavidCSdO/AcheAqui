"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function createPulsingIcon(delay: number) {
  return new L.DivIcon({
    className: "",
    html: `
      <div style="position: relative; width: 28px; height: 28px; animation: markerFadeIn 0.5s ease-out both; animation-delay: ${delay}s;">
        <div style="
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid rgba(167, 139, 250, 0.5);
          animation: markerPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: ${delay}s; opacity: 0;
        "></div>
        <div style="
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid rgba(167, 139, 250, 0.3);
          animation: markerPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: ${delay + 0.8}s; opacity: 0;
        "></div>
        <div style="
          width: 28px; height: 28px; background: #A78BFA;
          border: 3px solid #1e1b3a; border-radius: 50%;
          box-shadow: 0 0 12px rgba(167,139,250,0.6), 0 2px 8px rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
        ">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  });
}

export interface MapResult {
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  google_rating: number;
  lat: number;
  lng: number;
}

interface SmartSearchMapProps {
  results: MapResult[];
  batchSize?: number;
}

const PULSE_STYLE = `
  @keyframes markerPulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes markerFadeIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

// Sub-component to smoothly pan the map when batch changes
function MapPanner({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function SmartSearchMap({ results, batchSize = 4 }: SmartSearchMapProps) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  const totalBatches = Math.ceil(results.length / batchSize);
  const currentBatch = results.slice(batchIndex * batchSize, batchIndex * batchSize + batchSize);

  // Calculate center of current batch
  const batchCenter: [number, number] = currentBatch.length > 0
    ? [
        currentBatch.reduce((s, r) => s + r.lat, 0) / currentBatch.length,
        currentBatch.reduce((s, r) => s + r.lng, 0) / currentBatch.length,
      ]
    : [-23.565, -46.655];

  // Reveal markers one by one, then after all shown, wait and cycle to next batch
  useEffect(() => {
    setVisibleCount(0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reveal each marker with 600ms stagger
    for (let i = 0; i < currentBatch.length; i++) {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 600 * (i + 1)));
    }

    // After all revealed + 4s viewing time, move to next batch
    const cycleDelay = 600 * currentBatch.length + 4000;
    timers.push(
      setTimeout(() => {
        setBatchIndex((prev) => (prev + 1) % totalBatches);
      }, cycleDelay)
    );

    return () => timers.forEach(clearTimeout);
  }, [batchIndex, currentBatch.length, totalBatches]);

  // Reset to first batch if results change (e.g. new item added via search)
  useEffect(() => {
    setBatchIndex(0);
  }, [results.length]);

  const visibleMarkers = currentBatch.slice(0, visibleCount);

  return (
    <div className="h-[340px] rounded-[18px] overflow-hidden border border-white/[0.06] relative">
      <style dangerouslySetInnerHTML={{ __html: PULSE_STYLE }} />

      {/* Batch indicator */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5">
        {Array.from({ length: totalBatches }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i === batchIndex
                ? "bg-violet-400 scale-125 shadow-[0_0_6px_rgba(167,139,250,0.8)]"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute bottom-3 left-3 z-[1000] text-[0.6875rem] font-mono text-white/40 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
        {visibleCount}/{currentBatch.length} encontrados
      </div>

      <MapContainer
        center={batchCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapPanner center={batchCenter} />
        {visibleMarkers.map((r, i) => (
          <Marker key={`${batchIndex}-${i}`} position={[r.lat, r.lng]} icon={createPulsingIcon(0)}>
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: 180 }}>
                <strong style={{ fontSize: 13, color: "#0F172A" }}>{r.name}</strong>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{r.category}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{r.address}</div>
                <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>⭐ {r.google_rating}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
