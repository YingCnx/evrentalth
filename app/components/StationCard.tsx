"use client";

import { Zap, MapPin, Clock, Phone, ExternalLink } from "lucide-react";

type Connection = {
  ConnectionType?: { Title?: string };
  PowerKW?: number;
  Quantity?: number;
  StatusType?: { Title?: string };
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

function ConnectorBadge({ conn }: { conn: Connection }) {
  const title = conn.ConnectionType?.Title ?? "Unknown";
  const kw = conn.PowerKW;
  const isFast = kw && kw >= 50;
  const isDC = title.toLowerCase().includes("ccs") || title.toLowerCase().includes("chademo");

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        isFast
          ? "bg-orange-100 text-orange-700"
          : isDC
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <Zap size={10} />
      {title.split(" ")[0]}
      {kw ? ` ${kw}kW` : ""}
    </span>
  );
}

type Props = {
  station: Station;
  onClose: () => void;
};

export default function StationCard({ station, onClose }: Props) {
  const info = station.AddressInfo;
  const isOperational = station.StatusType?.IsOperational ?? true;
  const connections = station.Connections ?? [];

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${info.Latitude},${info.Longitude}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-sm">
      {/* Header */}
      <div className={`px-4 py-3 flex items-start justify-between gap-2 ${isOperational ? "bg-green-500" : "bg-gray-400"}`}>
        <div>
          <h2 className="text-white font-bold text-sm leading-tight">{info.Title}</h2>
          {station.OperatorInfo?.Title && (
            <p className="text-green-100 text-xs mt-0.5">{station.OperatorInfo.Title}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOperational ? "bg-white/20 text-white" : "bg-white/20 text-white"}`}>
            {isOperational ? "เปิดใช้งาน" : "ปิดชั่วคราว"}
          </span>
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">×</button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
          <p className="text-xs leading-relaxed">
            {[info.AddressLine1, info.Town, info.StateOrProvince].filter(Boolean).join(", ")}
          </p>
        </div>

        {/* Connectors */}
        {connections.length > 0 && (
          <div>
            <p className="text-[11px] text-gray-400 mb-1.5 font-medium uppercase tracking-wide">
              หัวชาร์จ / Connectors
            </p>
            <div className="flex flex-wrap gap-1.5">
              {connections.map((c, i) => (
                <ConnectorBadge key={i} conn={c} />
              ))}
            </div>
          </div>
        )}

        {/* Cost */}
        {station.UsageCost && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} className="flex-shrink-0 text-gray-400" />
            <p className="text-xs">{station.UsageCost}</p>
          </div>
        )}

        {/* Access comments */}
        {station.AccessComments && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            {station.AccessComments}
          </p>
        )}

        {/* Phone */}
        {info.ContactTelephone1 && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14} className="flex-shrink-0 text-gray-400" />
            <a href={`tel:${info.ContactTelephone1}`} className="text-xs hover:text-green-600">
              {info.ContactTelephone1}
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <MapPin size={14} /> นำทาง / Navigate
          </a>
          {station.OperatorInfo?.WebsiteURL && (
            <a
              href={station.OperatorInfo.WebsiteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 border border-gray-200 hover:border-green-400 text-gray-500 hover:text-green-600 rounded-xl transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
