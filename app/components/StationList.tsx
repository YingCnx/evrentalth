"use client";

import { Zap, MapPin, Star, ChevronRight } from "lucide-react";
import type { Station } from "./StationCard";
import { getNetworkInfo, mockRating } from "./StationCard";
import StationCard from "./StationCard";

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

function getStatus(station: Station) {
  const op = station.StatusType?.IsOperational ?? true;
  if (!op) return { label: "ออฟไลน์", textColor: "text-gray-400", bg: "bg-gray-100", dot: "bg-gray-400" };
  const mod = station.ID % 5;
  if (mod === 0) return { label: "เต็ม", textColor: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" };
  if (mod === 1) return { label: "ใกล้เต็ม", textColor: "text-orange-600", bg: "bg-orange-50", dot: "bg-orange-400" };
  return { label: "ว่าง", textColor: "text-green-700", bg: "bg-green-50", dot: "bg-green-500" };
}

type Props = {
  stations: Station[];
  userCoords: [number, number] | null;
  selected: Station | null;
  onSelect: (s: Station) => void;
  onClose: () => void;
};

export default function StationList({ stations, userCoords, selected, onSelect, onClose }: Props) {
  const origin = userCoords ?? [13.7563, 100.5018];

  const sorted = [...stations]
    .map((s) => ({
      s,
      km: haversineKm(origin[0], origin[1], s.AddressInfo.Latitude, s.AddressInfo.Longitude),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 10);

  return (
    <aside className="hidden md:flex flex-col w-72 xl:w-80 bg-white border-l border-gray-100 flex-shrink-0 overflow-hidden">
      {/* Sidebar header */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">สถานีใกล้คุณ</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            อัปเดตเมื่อ 1 นาทีที่แล้ว
          </div>
        </div>
        {!userCoords && (
          <p className="text-[10px] text-gray-400 mt-1">อนุญาต GPS เพื่อตำแหน่งที่แม่นยำ</p>
        )}
      </div>

      {/* Selected station detail */}
      {selected ? (
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 border-b border-gray-100">
            <button onClick={onClose}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
              ← กลับรายการ
            </button>
          </div>
          <StationCard station={selected} onClose={onClose} />
        </div>
      ) : (
        <>
          {/* Station list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                <Zap size={20} strokeWidth={1.5} />
                <span className="text-sm">ไม่พบสถานี</span>
              </div>
            )}
            {sorted.map(({ s, km }, i) => {
              const network = getNetworkInfo(s.OperatorInfo?.Title);
              const status = getStatus(s);
              const { rating, count } = mockRating(s.ID);
              const conn = s.Connections?.[0];
              const isDC = /ccs|chademo|dc/i.test(conn?.ConnectionType?.Title ?? "");

              return (
                <button key={s.ID} onClick={() => onSelect(s)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start gap-3">
                    {/* Rank + logo */}
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[11px] font-bold ${i === 0 ? "text-cyan-500" : "text-gray-300"}`}>{i + 1}</span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0"
                        style={{ background: network.bg, color: network.text }}>
                        {network.abbr}
                      </div>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-1 flex-1">
                          {s.AddressInfo.Title}
                        </p>
                        <span className="text-[11px] font-semibold text-gray-500 flex-shrink-0 ml-1">
                          {distLabel(km)}
                        </span>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${status.bg} ${status.textColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                        {conn?.PowerKW && (
                          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${isDC ? "text-orange-500" : "text-green-600"}`}>
                            <Zap size={9} fill="currentColor" />
                            {isDC ? "DC" : "AC"} {conn.PowerKW} kW
                          </span>
                        )}
                      </div>

                      {/* Connector type */}
                      {conn && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                          <MapPin size={9} />
                          {conn.ConnectionType?.Title?.split("(")[0].trim() ?? "EV"}
                          {conn.Quantity && conn.Quantity > 1 && ` · ${conn.Quantity} หัวชาร์จ`}
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={10} className="text-yellow-400" fill="currentColor" />
                        <span className="text-[11px] font-semibold text-gray-700">{rating}</span>
                        <span className="text-[10px] text-gray-400">({count})</span>
                        <ChevronRight size={12} className="text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer link */}
          {sorted.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 flex-shrink-0">
              <button className="w-full text-xs text-cyan-600 font-semibold hover:underline flex items-center justify-center gap-1">
                ดูสถานีทั้งหมดในพื้นที่นี้
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
