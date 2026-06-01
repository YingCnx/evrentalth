"use client";

import { Zap, MapPin, Clock, Phone, ExternalLink, X, Navigation } from "lucide-react";

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

function ConnectorBadge({ conn }: { conn: Connection }) {
  const title = conn.ConnectionType?.Title ?? "Charger";
  const kw = conn.PowerKW;
  const qty = conn.Quantity;
  const isDC = title.toLowerCase().match(/ccs|chademo|dc/);
  const isFast = kw && kw >= 50;

  const color = isFast
    ? "bg-orange-50 text-orange-600 border-orange-200"
    : isDC
    ? "bg-blue-50 text-blue-600 border-blue-200"
    : "bg-green-50 text-green-600 border-green-200";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${color}`}>
      <Zap size={10} />
      <span>{title.split(" ")[0]}{kw ? ` · ${kw}kW` : ""}{qty && qty > 1 ? ` × ${qty}` : ""}</span>
    </span>
  );
}

type Props = { station: Station; onClose: () => void };

export default function StationCard({ station, onClose }: Props) {
  const info = station.AddressInfo;
  const isOperational = station.StatusType?.IsOperational ?? true;
  const connections = station.Connections ?? [];
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${info.Latitude},${info.Longitude}`;

  const addressParts = [info.AddressLine1, info.Town, info.StateOrProvince].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOperational ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                {isOperational ? "เปิดใช้งาน" : "ปิดชั่วคราว"}
              </span>
              {station.OperatorInfo?.Title && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-[11px] text-gray-400">{station.OperatorInfo.Title}</span>
                </>
              )}
            </div>
            <h2 className="font-semibold text-gray-900 text-sm leading-snug">{info.Title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Address */}
        {addressParts.length > 0 && (
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 leading-relaxed">{addressParts.join(", ")}</p>
          </div>
        )}

        {/* Connectors */}
        {connections.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">หัวชาร์จ</p>
            <div className="flex flex-wrap gap-1.5">
              {connections.map((c, i) => <ConnectorBadge key={i} conn={c} />)}
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-col gap-1.5">
          {station.UsageCost && (
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <Zap size={13} className="text-gray-400 flex-shrink-0" />
              <span>{station.UsageCost}</span>
            </div>
          )}
          {station.AccessComments && (
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <Clock size={13} className="text-gray-400 flex-shrink-0" />
              <span>{station.AccessComments}</span>
            </div>
          )}
          {info.ContactTelephone1 && (
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <Phone size={13} className="text-gray-400 flex-shrink-0" />
              <a href={`tel:${info.ContactTelephone1}`} className="hover:text-green-600 transition-colors">
                {info.ContactTelephone1}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 flex gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <Navigation size={13} />
          นำทาง
        </a>
        {station.OperatorInfo?.WebsiteURL && (
          <a
            href={station.OperatorInfo.WebsiteURL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 rounded-xl transition-colors"
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
