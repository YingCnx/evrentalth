"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Zap, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import SearchFilter, { type FilterState } from "./SearchFilter";
import type { Station } from "./StationCard";
import StationCard from "./StationCard";
import StationList from "./StationList";

const Map = dynamic(() => import("./Map"), { ssr: false, loading: () => <MapSkeleton /> });

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
}

const PROVINCE_COORDS: Record<string, [number, number]> = {
  "กรุงเทพมหานคร": [13.7563, 100.5018],
  "เชียงใหม่": [18.7883, 98.9853],
  "ภูเก็ต": [7.8804, 98.3923],
  "ชลบุรี": [13.3611, 100.9847],
  "ขอนแก่น": [16.4322, 102.8236],
  "นครราชสีมา": [14.9798, 102.0978],
  "เชียงราย": [19.9105, 99.8406],
  "อุดรธานี": [17.4138, 102.7872],
  "สุราษฎร์ธานี": [9.1382, 99.3211],
  "นครศรีธรรมราช": [8.4304, 99.9631],
  "หาดใหญ่": [7.0062, 100.4747],
  "ระยอง": [12.6814, 101.2816],
  "นนทบุรี": [13.8622, 100.5134],
  "ปทุมธานี": [14.0208, 100.5259],
  "สมุทรปราการ": [13.5990, 100.5998],
};

export default function EVChargeApp() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [focusCoords, setFocusCoords] = useState<[number, number] | undefined>(undefined);
  const [resetView, setResetView] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const lastFilter = useRef<FilterState>({ province: "", chargerType: "" });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  const fetchStations = useCallback(async (filter: FilterState) => {
    setLoading(true);
    setError("");
    setSelected(null);

    const params = new URLSearchParams();
    if (filter.province) params.set("province", filter.province);
    if (filter.chargerType) params.set("chargerType", filter.chargerType);

    try {
      const res = await fetch(`/api/stations?${params}`);
      if (!res.ok) throw new Error();
      const data: Station[] = await res.json();
      setStations(data);
    } catch {
      setError("โหลดข้อมูลไม่ได้ กรุณาลองใหม่ / Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilter = useCallback((f: FilterState) => {
    lastFilter.current = f;
    const isReset = !f.province && !f.chargerType;
    if (isReset) {
      // Clear filter → reset map to fit all Thailand
      setFocusCoords(undefined);
      setResetView((v) => !v); // toggle to trigger fitBounds in Map
    } else {
      setFocusCoords(f.province ? PROVINCE_COORDS[f.province] : undefined);
      setResetView(false);
    }
    fetchStations(f);
  }, [fetchStations]);

  useEffect(() => {
    fetchStations({ province: "", chargerType: "" });
  }, [fetchStations]);

  const handleSelect = (s: Station) => {
    setSelected(s);
    setPanelOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setPanelOpen(false);
  };

  const listOrigin: [number, number] | null =
    userCoords ??
    (lastFilter.current.province ? PROVINCE_COORDS[lastFilter.current.province] ?? null : null);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 z-20 px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <div className="leading-none">
            <p className="font-bold text-sm text-gray-900 tracking-tight">EV Charge Map</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Thailand</p>
          </div>
        </div>
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <SearchFilter onFilter={handleFilter} stationCount={stations.length} />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <Map
              stations={stations}
              onSelect={handleSelect}
              selected={selected}
              focusCoords={focusCoords}
              resetView={resetView}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3">
                <Loader2 className="animate-spin text-green-500" size={20} />
                <span className="text-sm text-gray-600">กำลังโหลด...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-md max-w-xs">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
              <button onClick={() => fetchStations(lastFilter.current)} className="ml-1 text-red-500 underline text-xs">ลองใหม่</button>
            </div>
          )}

          {/* Mobile: bottom sheet */}
          {selected && (
            <div className={`absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 md:hidden ${panelOpen ? "translate-y-0" : "translate-y-full"}`}>
              <div className="bg-white rounded-t-3xl shadow-2xl">
                <div className="flex justify-center pt-3 pb-1">
                  <button onClick={() => setPanelOpen(!panelOpen)} className="text-gray-300">
                    <ChevronDown size={24} />
                  </button>
                </div>
                <div className="px-4 pb-6 overflow-y-auto max-h-[70vh]">
                  <StationCard station={selected} onClose={handleClose} />
                </div>
              </div>
            </div>
          )}

          {/* Mobile fab */}
          {selected && !panelOpen && (
            <button className="md:hidden absolute bottom-4 right-4 z-30 bg-white rounded-full shadow-lg p-3" onClick={() => setPanelOpen(true)}>
              <Zap size={20} className="text-green-500" />
            </button>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm border border-gray-100 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />จุดชาร์จ
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />เลือกอยู่
            </div>
          </div>
        </main>

        {/* Sidebar — shows list or station detail */}
        <StationList
          stations={stations}
          userCoords={listOrigin}
          selected={selected}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-5 py-2 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">© 2026 EV Charge Map Thailand</p>
        <p className="text-[10px] text-gray-400">
          ข้อมูลจาก{" "}
          <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 underline transition-colors">
            OpenStreetMap
          </a>
        </p>
      </footer>
    </div>
  );
}
