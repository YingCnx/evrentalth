"use client";

import { Zap, MapPin, Navigation2 } from "lucide-react";
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

function distLabel(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} ม.`;
  if (km < 10) return `${km.toFixed(1)} กม.`;
  return `${Math.round(km)} กม.`;
}

function ConnTag({ title, kw }: { title: string; kw?: number }) {
  const isDC = /ccs|chademo|dc/i.test(title);
  const isFast = kw && kw >= 50;
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
      isFast ? "bg-orange-50 text-orange-500" : isDC ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-600"
    }`}>
      {title.split(" ")[0]}{kw ? ` ${kw}kW` : ""}
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
  const origin = userCoords ?? [13.7563, 100.5018];

  const sorted = [...stations]
    .map((s) => ({
      s,
      km: haversineKm(origin[0], origin[1], s.AddressInfo.Latitude, s.AddressInfo.Longitude),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 10);

  return (
    <aside className="hidden md:flex flex-col w-64 xl:w-72 bg-white border-l border-gray-100 flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation2 size={14} className="text-green-500" />
            <span className="text-sm font-semibold text-gray-800">ใกล้ฉัน</span>
          </div>
          <span className="text-[11px] text-gray-400">
            {userCoords ? "GPS" : "ค่าเริ่มต้น กทม."}
          </span>
        </div>
        {!userCoords && (
          <p className="text-[10px] text-gray-400 mt-1">
            อนุญาต GPS เพื่อตำแหน่งที่แม่นยำ
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
            <Zap size={20} strokeWidth={1.5} />
            <span className="text-sm">ไม่พบสถานี</span>
          </div>
        ) : (
          sorted.map(({ s, km }, i) => {
            const isActive = selected?.ID === s.ID;
            const conn = s.Connections?.[0];
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.AddressInfo.Latitude},${s.AddressInfo.Longitude}`;

            return (
              <button
                key={s.ID}
                onClick={() => onSelect(s)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors group relative ${
                  isActive ? "bg-green-50" : ""
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500 rounded-r" />
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {/* Number */}
                    <span className={`flex-shrink-0 text-[11px] font-bold w-5 text-right pt-0.5 ${
                      i === 0 ? "text-green-500" : "text-gray-300"
                    }`}>
                      {i + 1}
                    </span>

                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate leading-snug ${isActive ? "text-green-700" : "text-gray-800"}`}>
                        {s.AddressInfo.Title}
                      </p>

                      {s.AddressInfo.Town && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5 truncate">
                          <MapPin size={9} />
                          {s.AddressInfo.Town}
                        </p>
                      )}

                      {conn && (
                        <div className="mt-1.5">
                          <ConnTag title={conn.ConnectionType?.Title ?? "EV"} kw={conn.PowerKW} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-[11px] font-semibold ${i === 0 ? "text-green-500" : "text-gray-500"}`}>
                      {distLabel(km)}
                    </span>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-100"
                      title="นำทาง"
                    >
                      <Navigation2 size={12} className="text-gray-400" />
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
