"use client";

import { useState } from "react";
import { Navigation, Zap, Loader2, AlertTriangle, CheckCircle2, MapPin, ChevronRight, RotateCcw, Info, Banknote, Clock } from "lucide-react";
import { PROVINCE_COORDS, PROVINCES } from "../lib/provinces";

export type RouteStation = {
  id: number;
  lat: number;
  lon: number;
  name: string;
  operator?: string;
  posAlong: number;
  distFromPrev: number;
  distToRoute: number;
  reachable: boolean;
  openingHours?: string;
  fee?: string;
  connectors?: string[];
};

export type RouteResult = {
  route: [number, number][];
  totalDistKm: number;
  stations: RouteStation[];
  distLastToDest: number;
  destReachable: boolean;
  usedFallback: boolean;
};

type Props = {
  onResult: (result: RouteResult | null, origin: [number, number] | null, dest: [number, number] | null) => void;
  onStationSelect?: (station: RouteStation | null) => void;
  initialOrigin?: string;
  initialDest?: string;
};

export default function RoutePlanner({ onResult, onStationSelect, initialOrigin = "", initialDest = "" }: Props) {
  const [originName, setOriginName] = useState(initialOrigin);
  const [destName, setDestName] = useState(initialDest);
  const [carRange, setCarRange] = useState(400);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [selectedStation, setSelectedStation] = useState<RouteStation | null>(null);

  const originCoords = PROVINCE_COORDS[originName];
  const destCoords = PROVINCE_COORDS[destName];
  const canSearch = originCoords && destCoords && originName !== destName;

  // Greedy minimum-stop plan: always go to the furthest reachable station
  const minStopPlan = result ? (() => {
    const stops: RouteStation[] = [];
    let pos = 0;
    let i = 0;
    const sorted = result.stations;
    while (pos + carRange < result.totalDistKm) {
      let furthest: RouteStation | null = null;
      while (i < sorted.length && sorted[i].posAlong <= pos + carRange) {
        furthest = sorted[i];
        i++;
      }
      if (!furthest) return null; // gap too large, impossible
      stops.push(furthest);
      pos = furthest.posAlong;
    }
    return stops;
  })() : null;

  const search = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSelectedStation(null);
    onResult(null, null, null);

    const params = new URLSearchParams({
      oLat: String(originCoords[0]), oLon: String(originCoords[1]),
      dLat: String(destCoords[0]), dLon: String(destCoords[1]),
      range: String(carRange),
    });

    try {
      const res = await fetch(`/api/route?${params}`);
      if (!res.ok) throw new Error();
      const data: RouteResult = await res.json();
      setResult(data);
      onResult(data, originCoords, destCoords);
    } catch {
      setError("ไม่สามารถคำนวณเส้นทางได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSelectedStation(null);
    setError("");
    onResult(null, null, null);
    onStationSelect?.(null);
  };

  return (
    <aside className="hidden md:flex flex-col w-72 xl:w-80 bg-white border-l border-gray-100 flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Navigation size={14} className="text-green-500" />
          <span className="text-sm font-semibold text-gray-800">วางแผนเส้นทาง</span>
          {result && (
            <button onClick={reset} className="ml-auto p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <RotateCcw size={13} />
            </button>
          )}
        </div>

        {/* Origin */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 border border-white ring-1 ring-green-400" />
            <input
              list="route-province-list"
              value={originName}
              onChange={(e) => setOriginName(e.target.value)}
              placeholder="ต้นทาง..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              autoComplete="off"
            />
          </div>

          {/* Route line visual */}
          <div className="flex items-center gap-2 px-3">
            <div className="w-2 flex flex-col items-center gap-0.5">
              {[...Array(3)].map((_, i) => <div key={i} className="w-0.5 h-1 bg-gray-300 rounded" />)}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 border border-white ring-1 ring-red-400" />
            <input
              list="route-province-list"
              value={destName}
              onChange={(e) => setDestName(e.target.value)}
              placeholder="ปลายทาง..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              autoComplete="off"
            />
          </div>
        </div>

        <datalist id="route-province-list">
          {PROVINCES.map((p) => <option key={p} value={p} />)}
        </datalist>

        {/* Car range */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              <Zap size={10} className="text-green-500" />
              ระยะต่อชาร์จ
            </label>
            <span className="text-[11px] font-bold text-gray-700">{carRange} กม.</span>
          </div>
          <input
            type="range" min={100} max={800} step={50} value={carRange}
            onChange={(e) => setCarRange(+e.target.value)}
            className="w-full h-1.5 accent-green-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>100</span><span>800 กม.</span>
          </div>
        </div>

        <button
          onClick={search}
          disabled={!canSearch || loading}
          className="w-full mt-3 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" />กำลังคำนวณ...</> : <><Navigation size={14} />หาจุดชาร์จตามเส้นทาง</>}
        </button>

        {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="flex-1 overflow-y-auto">
          {/* Summary bar */}
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{originName} → {destName}</span>
              <span className="font-bold text-gray-800">{result.totalDistKm} กม.</span>
            </div>
            {/* Minimum stop answer */}
            <div className={`mt-2 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${
              minStopPlan === null
                ? "bg-red-50 text-red-600"
                : minStopPlan.length === 0
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}>
              <Zap size={12} className="flex-shrink-0" />
              {minStopPlan === null
                ? "แบตไม่พอ — มีช่วงที่ไม่มีจุดชาร์จเลย"
                : minStopPlan.length === 0
                ? `ไปถึงได้เลย ไม่ต้องแวะชาร์จ (แบต ${carRange} กม.)`
                : `ต้องแวะชาร์จ ${minStopPlan.length} จุด (แบต ${carRange} กม.)`}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
              <span>{result.stations.length} จุดชาร์จตามเส้นทาง</span>
              {result.usedFallback && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Info size={10} />เส้นทางโดยประมาณ
                </span>
              )}
            </div>
          </div>

          {/* Station list */}
          <div className="divide-y divide-gray-50">
            {/* Origin marker */}
            <div className="px-4 py-2.5 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <MapPin size={11} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{originName}</p>
                <p className="text-[10px] text-gray-400">ต้นทาง · 0 กม.</p>
              </div>
            </div>

            {result.stations.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Zap size={24} className="text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">ไม่พบจุดชาร์จในรัศมี 15 กม. จากเส้นทาง</p>
              </div>
            ) : (
              result.stations.map((s, i) => {
                const isSelected = selectedStation?.id === s.id;
                const isRequired = minStopPlan?.some(p => p.id === s.id) ?? false;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`;

                return (
                  <button
                    key={s.id}
                    onClick={() => { const next = isSelected ? null : s; setSelectedStation(next); onStationSelect?.(next); }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${isSelected ? "bg-green-50" : ""}`}
                  >
                    {/* Distance from prev */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.reachable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {s.reachable ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />} +{s.distFromPrev} กม.
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isRequired ? "bg-blue-100" : s.reachable ? "bg-green-100" : "bg-red-100"}`}>
                        {isRequired
                          ? <Zap size={12} className="text-blue-600" />
                          : s.reachable
                          ? <CheckCircle2 size={12} className="text-green-600" />
                          : <AlertTriangle size={12} className="text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                          {isRequired && <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">แวะที่นี่</span>}
                        </div>
                        {s.operator && s.operator !== s.name && (
                          <p className="text-[10px] text-gray-400 truncate">{s.operator}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] text-gray-500">{s.posAlong} กม. จากต้นทาง</span>
                          {s.distToRoute > 0 && (
                            <span className="text-[10px] text-gray-400">ห่างเส้นทาง {s.distToRoute} กม.</span>
                          )}
                        </div>
                        {/* Connector tags */}
                        {s.connectors && s.connectors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.connectors.map((c, ci) => (
                              <span key={ci} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Detail when selected */}
                        {isSelected && (
                          <div className="mt-2 space-y-1">
                            {s.fee && <p className="text-[10px] text-gray-500 flex items-center gap-1"><Banknote size={10} /> {s.fee}</p>}
                            {s.openingHours && <p className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10} /> {s.openingHours}</p>}
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 mt-1 text-[11px] text-green-600 font-medium hover:underline"
                            >
                              <Navigation size={10} />นำทางไปจุดชาร์จ
                              <ChevronRight size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 flex-shrink-0">{i + 1}</span>
                    </div>
                  </button>
                );
              })
            )}

            {/* Destination */}
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${result.destReachable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {result.destReachable ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />} +{result.distLastToDest} กม.
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="px-4 py-2.5 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <MapPin size={11} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{destName}</p>
                  <p className="text-[10px] text-gray-400">ปลายทาง · {result.totalDistKm} กม.</p>
                </div>
              </div>
            </div>

            {/* Warning if any unreachable */}
            {result.stations.some(s => !s.reachable) && (
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                <p className="text-[11px] text-amber-700 flex items-start gap-1.5">
                  <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                  บางช่วงระยะทางเกินกว่าแบตจะถึง ควรชาร์จให้เต็มก่อนออกเดินทาง หรือเพิ่มจุดชาร์จระหว่างทาง
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
            <Navigation size={22} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">วางแผนเส้นทาง EV</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">เลือกต้นทางและปลายทาง แล้วดูจุดชาร์จตลอดเส้นทาง</p>
          </div>
        </div>
      )}
    </aside>
  );
}
