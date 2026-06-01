"use client";

import { Zap, MapPin, Star, Bookmark, Navigation, Info, UtensilsCrossed, Coffee, ShoppingBag, SquareParking, Wifi } from "lucide-react";

type Connection = {
  ConnectionType?: { Title?: string };
  PowerKW?: number;
  Quantity?: number;
};

export type Station = {
  ID: number;
  AddressInfo: {
    Title: string;
    AddressLine1?: string;
    Town?: string;
    StateOrProvince?: string;
    Latitude: number;
    Longitude: number;
    ContactTelephone1?: string;
  };
  Connections?: Connection[];
  OperatorInfo?: { Title?: string; WebsiteURL?: string };
  StatusType?: { Title?: string; IsOperational?: boolean };
  UsageCost?: string;
  AccessComments?: string;
};

export function getNetworkInfo(operatorTitle?: string) {
  const t = (operatorTitle ?? "").toLowerCase();
  if (t.includes("ptt")) return { abbr: "PTT", bg: "#E8421A", text: "#fff" };
  if (t.includes("ea") || t.includes("anywhere")) return { abbr: "EA", bg: "#1565C0", text: "#fff" };
  if (t.includes("elexa")) return { abbr: "EX", bg: "#0D1B2A", text: "#00C8FF" };
  if (t.includes("pluz") || t.includes("ev station")) return { abbr: "EV", bg: "#00897B", text: "#fff" };
  if (t.includes("pea") || t.includes("volta")) return { abbr: "PEA", bg: "#6A1B9A", text: "#fff" };
  if (t.includes("sharge")) return { abbr: "SH", bg: "#F57F17", text: "#fff" };
  return { abbr: "EV", bg: "#374151", text: "#fff" };
}

export function mockRating(id: number) {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 4.3, 4.4];
  const counts = [36, 58, 74, 96, 128, 24, 81];
  const i = id % ratings.length;
  return { rating: ratings[i], count: counts[i] };
}

function mockAvailability(conn: Connection, seed: number) {
  const total = conn.Quantity ?? 2;
  const used = seed % 3 === 0 ? total : seed % 3 === 1 ? Math.floor(total / 2) : 0;
  return { avail: Math.max(0, total - used), total };
}

const AMENITIES = [
  { Icon: UtensilsCrossed, label: "ร้านอาหาร" },
  { Icon: Coffee, label: "กาแฟ" },
  { Icon: ShoppingBag, label: "ห้าง" },
  { Icon: SquareParking, label: "ที่จอดรถ" },
  { Icon: Wifi, label: "Wi-Fi" },
];

type Props = { station: Station; onClose: () => void };

export default function StationCard({ station, onClose }: Props) {
  const info = station.AddressInfo;
  const isOperational = station.StatusType?.IsOperational ?? true;
  const connections = station.Connections ?? [];
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${info.Latitude},${info.Longitude}`;
  const { rating, count } = mockRating(station.ID);
  const network = getNetworkInfo(station.OperatorInfo?.Title);

  const dcConns = connections.filter((c) => /ccs|chademo|dc|gb.t dc/i.test(c.ConnectionType?.Title ?? ""));
  const acConns = connections.filter((c) => !/ccs|chademo|dc|gb.t dc/i.test(c.ConnectionType?.Title ?? ""));

  const totalAvail = connections.reduce((sum, c, i) => {
    const { avail } = mockAvailability(c, station.ID + i);
    return sum + avail;
  }, 0);
  const totalConnectors = connections.reduce((sum, c) => sum + (c.Quantity ?? 1), 0);

  return (
    <div className="bg-white w-full" onClick={(e) => e.stopPropagation()}>
      {/* Top: photo + info */}
      <div className="flex">
        {/* Network photo */}
        <div className="w-28 sm:w-36 flex-shrink-0 flex items-center justify-center"
          style={{ background: network.bg, minHeight: 110 }}>
          <span className="text-2xl font-black" style={{ color: network.text }}>{network.abbr}</span>
        </div>

        {/* Info block */}
        <div className="flex-1 min-w-0 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-bold text-gray-900 text-sm leading-snug flex-1">{info.Title}</h2>
            <button className="flex-shrink-0 text-gray-300 hover:text-cyan-500 transition-colors mt-0.5">
              <Bookmark size={15} />
            </button>
          </div>
          <div className="flex items-start gap-1 mt-1 text-xs text-gray-500">
            <MapPin size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{[info.AddressLine1, info.Town].filter(Boolean).join(", ")}</span>
          </div>
          {info.StateOrProvince && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{info.StateOrProvince}</span>
              <a href={`https://www.google.com/maps?q=${info.Latitude},${info.Longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-cyan-600 hover:underline font-medium">
                ดูบนแผนที่
              </a>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" fill="currentColor" />
              <span className="text-xs font-semibold text-gray-800">{rating}</span>
              <span className="text-xs text-gray-400">({count} รีวิว)</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${totalAvail > 0 && isOperational ? "text-green-600" : "text-red-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${totalAvail > 0 && isOperational ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              {isOperational
                ? (totalAvail > 0 ? `ว่าง ${totalAvail}/${totalConnectors} หัว` : "เต็มทุกหัว")
                : "ออฟไลน์"}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">อัปเดตเมื่อ 1 นาทีที่แล้ว</p>
        </div>
      </div>

      {/* Middle: connectors + amenities */}
      <div className="flex border-t border-gray-100">
        {/* Connector details */}
        <div className="flex-1 px-4 py-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">หัวชาร์จและกำลังไฟ</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {dcConns.map((c, i) => {
              const { avail, total } = mockAvailability(c, station.ID + i);
              return (
                <div key={`dc-${i}`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Zap size={11} className="text-orange-500" fill="currentColor" />
                    <span className="text-xs font-bold text-gray-800">DC {c.PowerKW ?? "?"} kW</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{c.ConnectionType?.Title?.split("(")[0].trim() ?? "CCS2"}</p>
                  <p className={`text-[11px] font-semibold ${avail > 0 ? "text-green-600" : "text-red-500"}`}>{avail}/{total} ว่าง</p>
                </div>
              );
            })}
            {acConns.map((c, i) => {
              const { avail, total } = mockAvailability(c, station.ID + i + 1);
              return (
                <div key={`ac-${i}`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Zap size={11} className="text-green-500" fill="currentColor" />
                    <span className="text-xs font-bold text-gray-800">AC {c.PowerKW ?? "?"} kW</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{c.ConnectionType?.Title?.split("(")[0].trim() ?? "Type 2"}</p>
                  <p className={`text-[11px] font-semibold ${avail > 0 ? "text-green-600" : "text-red-500"}`}>{avail}/{total} ว่าง</p>
                </div>
              );
            })}
            {connections.length === 0 && (
              <p className="col-span-2 text-xs text-gray-400">ไม่มีข้อมูลหัวชาร์จ</p>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="w-28 sm:w-32 border-l border-gray-100 px-3 py-3 flex-shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">สิ่งอำนวยความสะดวก</p>
          <div className="flex flex-wrap gap-1.5">
            {AMENITIES.map(({ Icon, label }, i) => {
              const has = (station.ID + i) % 3 !== 0;
              return (
                <div key={label}
                  className={`p-1.5 rounded-lg transition-colors ${has ? "bg-cyan-50 text-cyan-600" : "bg-gray-50 text-gray-300"}`}
                  title={label}>
                  <Icon size={13} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors"
          style={{ background: "#00C8FF", color: "#08101e" }}>
          <Navigation size={15} />
          นำทาง
        </a>
        {station.OperatorInfo?.WebsiteURL ? (
          <a href={station.OperatorInfo.WebsiteURL} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors">
            <Info size={15} />
            รายละเอียด
          </a>
        ) : (
          <button onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors">
            <Info size={15} />
            รายละเอียด
          </button>
        )}
      </div>
    </div>
  );
}
