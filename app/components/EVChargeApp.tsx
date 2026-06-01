"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Zap, Loader2, AlertCircle, X, ChevronDown } from "lucide-react";
import SearchFilter, { type FilterState } from "./SearchFilter";
import StationCard, { type Station } from "./StationCard";

const Map = dynamic(() => import("./Map"), { ssr: false, loading: () => <MapSkeleton /> });

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
}

// Province → approx center coords for search
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

const CHARGER_FILTER_MAP: Record<string, { connectiontypeid?: string; levelid?: string }> = {
  ac: { connectiontypeid: "25,1036" },  // Type 1, Type 2
  dc: { connectiontypeid: "32,33" },    // CHAdeMO, CCS
  fast: { levelid: "3" },               // DC Fast
};

export default function EVChargeApp() {
  const [stations, setStations] = useState<Station[]>([]);
  const [filtered, setFiltered] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const lastFilter = useRef<FilterState>({ province: "", chargerType: "" });

  const fetchStations = useCallback(async (filter: FilterState) => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ maxresults: "200" });

    if (filter.province && PROVINCE_COORDS[filter.province]) {
      const [lat, lng] = PROVINCE_COORDS[filter.province];
      params.set("latitude", String(lat));
      params.set("longitude", String(lng));
      params.set("distance", "80");
    }

    const extra = filter.chargerType ? CHARGER_FILTER_MAP[filter.chargerType] : {};
    if (extra?.connectiontypeid) params.set("connectiontypeid", extra.connectiontypeid);
    if (extra?.levelid) params.set("levelid", extra.levelid);

    try {
      const res = await fetch(`/api/stations?${params}`);
      if (!res.ok) throw new Error();
      const data: Station[] = await res.json();
      setStations(data);
      applyLocalFilter(data, filter);
    } catch {
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง / Failed to load stations.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side text filter on province name
  function applyLocalFilter(data: Station[], filter: FilterState) {
    if (!filter.province) {
      setFiltered(data);
      return;
    }
    setFiltered(
      data.filter((s) => {
        const state = s.AddressInfo.StateOrProvince ?? "";
        const town = s.AddressInfo.Town ?? "";
        return state.includes(filter.province) || town.includes(filter.province);
      })
    );
  }

  const handleFilter = useCallback((f: FilterState) => {
    lastFilter.current = f;
    fetchStations(f);
  }, [fetchStations]);

  useEffect(() => {
    fetchStations({ province: "", chargerType: "" });
  }, [fetchStations]);

  const handleSelect = (s: Station) => {
    setSelected(s);
    setPanelOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white shadow-sm z-20 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-green-500 text-white p-1.5 rounded-lg">
            <Zap size={18} fill="white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm text-gray-800">EV Charge Map</p>
            <p className="text-[10px] text-gray-400">Thailand</p>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <SearchFilter
            onFilter={handleFilter}
            stationCount={filtered.length}
          />
        </div>
      </header>

      {/* Main area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Map */}
        <div className="absolute inset-0">
          <Map stations={filtered} onSelect={handleSelect} selected={selected} />
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3">
              <Loader2 className="animate-spin text-green-500" size={20} />
              <span className="text-sm text-gray-600">กำลังโหลด... / Loading</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-md max-w-xs">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
            <button onClick={() => fetchStations(lastFilter.current)} className="ml-1 text-red-500 underline text-xs">
              ลองใหม่
            </button>
          </div>
        )}

        {/* Station detail panel — mobile bottom sheet, desktop floating card */}
        {selected && (
          <>
            {/* Mobile: bottom sheet */}
            <div
              className={`absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 md:hidden ${panelOpen ? "translate-y-0" : "translate-y-full"}`}
            >
              <div className="bg-white rounded-t-3xl shadow-2xl">
                <div className="flex justify-center pt-3 pb-1">
                  <button onClick={() => setPanelOpen(!panelOpen)} className="text-gray-300">
                    <ChevronDown size={24} />
                  </button>
                </div>
                <div className="px-4 pb-6 overflow-y-auto max-h-[70vh]">
                  <StationCard station={selected} onClose={() => { setSelected(null); setPanelOpen(false); }} />
                </div>
              </div>
            </div>

            {/* Desktop: floating card */}
            <div className="hidden md:block absolute top-4 right-4 z-30 w-80">
              <StationCard station={selected} onClose={() => setSelected(null)} />
            </div>
          </>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            เปิดใช้งาน / Active
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
            สถานีที่เลือก / Selected
          </div>
        </div>

        {/* Close selected hint on mobile */}
        {selected && !panelOpen && (
          <button
            className="md:hidden absolute bottom-4 right-4 z-30 bg-white rounded-full shadow-lg p-3"
            onClick={() => setPanelOpen(true)}
          >
            <Zap size={20} className="text-green-500" />
          </button>
        )}
      </main>

      {/* Footer — SEO text */}
      <footer className="bg-white border-t border-gray-100 px-4 py-2 text-center">
        <p className="text-[10px] text-gray-400">
          ข้อมูลจาก{" "}
          <a href="https://openchargemap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600">
            OpenChargeMap
          </a>{" "}
          · จุดชาร์จรถไฟฟ้าทั่วไทย · EV Charging Stations Thailand · อัปเดตทุก 5 นาที
        </p>
      </footer>
    </div>
  );
}
