"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

const NETWORKS = [
  { name: "EA Anywhere", count: 1245, color: "#22d3ee" },
  { name: "EV Station PluZ", count: 892, color: "#a78bfa" },
  { name: "PEA VOLTA", count: 624, color: "#34d399" },
  { name: "EleXA", count: 298, color: "#f97316" },
  { name: "PTT EV Station", count: 267, color: "#fbbf24" },
];

export default function HeroMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !mapRef.current) return;
    initRef.current = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
      }).setView([13.0, 101.5], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);

      fetch("/api/stations?province=")
        .then((r) => r.json())
        .then((data) => {
          const stations = data.stations || [];
          stations.forEach((s: { AddressInfo: { Latitude: number; Longitude: number } }) => {
            const icon = L.divIcon({
              className: "",
              html: `<div style="background:#22d3ee;width:8px;height:8px;border-radius:50%;border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
              iconSize: [8, 8],
              iconAnchor: [4, 4],
            });
            L.marker([s.AddressInfo.Latitude, s.AddressInfo.Longitude], { icon }).addTo(map);
          });
        })
        .catch(() => {});
    });

    return () => { map?.remove(); };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {/* Network stats overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 z-[400] min-w-[190px]">
        <p className="font-bold text-gray-800 mb-2 text-xs">เครือข่ายผู้ให้บริการ</p>
        {NETWORKS.map((n) => (
          <div key={n.name} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.color }} />
              <span className="text-[11px] text-gray-600">{n.name}</span>
            </div>
            <span className="text-[11px] font-semibold text-gray-800">{n.count.toLocaleString()}</span>
          </div>
        ))}
        <div className="mt-2 pt-1.5 border-t border-gray-100">
          <Link href="/chargers" className="text-cyan-600 font-semibold text-[10px] hover:underline flex items-center gap-0.5">
            ดูทั้งหมด 15 เครือข่าย →
          </Link>
        </div>
      </div>
    </div>
  );
}
