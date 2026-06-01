"use client";

import { Zap, MapPin, Navigation, ChevronRight } from "lucide-react";
import type { Station } from "./StationCard";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distanceLabel(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} ม.`;
  if (km < 10) return `${km.toFixed(1)} กม.`;
  return `${Math.round(km)} กม.`;
}

function ConnectorChip({ title, kw }: { title: string; kw?: number }) {
  const isDC =
    title.toLowerCase().includes("ccs") ||
    title.toLowerCase().includes("chademo") ||
    title.toLowerCase().includes("dc");
  const isFast = kw && kw >= 50;
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
        isFast
          ? "bg-orange-100 text-orange-700"
          : isDC
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <Zap size={9} />
      {title.split(" ")[0]}
      {kw ? ` ${kw}kW` : ""}
    </span>
  );
}

type Props = {
  stations: Station[];
  userCoords: [number, number] | null;
  selected: Station | null;
  onSelect: (s: Station) => void;
};

export default function StationList({ stations, userCoords, selected, onSelect }: Props) {
  // Sort by distance from user (or map default if no geolocation)
  const origin = userCoords ?? [13.7563, 100.5018]; // fallback: Bangkok

  const sorted = [...stations]
    .map((s) => ({
      station: s,
      km: haversineKm(
        origin[0],
        origin[1],
        s.AddressInfo.Latitude,
        s.AddressInfo.Longitude
      ),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 10);

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-l border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Navigation size={15} className="text-green-500" />
          <p className="font-bold text-sm text-gray-800">ใกล้ฉันที่สุด</p>
          {!userCoords && (
            <span className="text-[10px] text-gray-400 ml-auto">ใช้ตำแหน่ง กทม.</span>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {userCoords ? "เรียงจากใกล้ → ไกล" : "อนุญาต GPS เพื่อตำแหน่งที่แม่นยำ"}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            ไม่พบสถานี
          </div>
        ) : (
          sorted.map(({ station, km }, i) => {
            const isSelected = selected?.ID === station.ID;
            const conn = station.Connections?.[0];
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.AddressInfo.Latitude},${station.AddressInfo.Longitude}`;

            return (
              <button
                key={station.ID}
                onClick={() => onSelect(station)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors group ${
                  isSelected ? "bg-green-50 border-l-2 border-l-green-500" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Rank */}
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5 ${
                      i === 0
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
                      {station.AddressInfo.Title}
                    </p>

                    {station.AddressInfo.Town && (
                      <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                        <MapPin size={9} />
                        {[station.AddressInfo.Town, station.AddressInfo.StateOrProvince]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {conn && (
                        <ConnectorChip
                          title={conn.ConnectionType?.Title ?? "Charger"}
                          kw={conn.PowerKW}
                        />
                      )}
                      {station.UsageCost && (
                        <span className="text-[10px] text-gray-400">{station.UsageCost}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[11px] font-bold text-green-600">
                      {distanceLabel(km)}
                    </span>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="นำทาง"
                    >
                      <ChevronRight size={14} className="text-gray-400 hover:text-green-500" />
                    </a>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
