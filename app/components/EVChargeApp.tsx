"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Zap, Loader2, AlertCircle, ChevronDown, Navigation, List,
  Search, MapPin, Car, Calculator, BookOpen, User, Moon,
  Filter, ChevronRight, LocateFixed,
} from "lucide-react";
import SearchFilter, { type FilterState } from "./SearchFilter";
import type { Station } from "./StationCard";
import StationList from "./StationList";
import type { RouteResult, RouteStation } from "./RoutePlanner";

const Map = dynamic(() => import("./Map"), { ssr: false, loading: () => <MapSkeleton /> });
const RoutePlanner = dynamic(() => import("./RoutePlanner"), { ssr: false });

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
}

const PROVINCE_COORDS: Record<string, [number, number]> = {
  "กรุงเทพมหานคร": [13.7563, 100.5018], "นนทบุรี": [13.8622, 100.5134], "ปทุมธานี": [14.0208, 100.5259],
  "สมุทรปราการ": [13.5990, 100.5998], "สมุทรสาคร": [13.5475, 100.2747], "สมุทรสงคราม": [13.4098, 100.0023],
  "นครปฐม": [13.8199, 100.0624], "สุพรรณบุรี": [14.4744, 100.1177], "กาญจนบุรี": [14.0023, 99.5328],
  "ราชบุรี": [13.5282, 99.8134], "เพชรบุรี": [13.1120, 99.9398], "ประจวบคีรีขันธ์": [11.8126, 99.7957],
  "อ่างทอง": [14.5896, 100.4550], "พระนครศรีอยุธยา": [14.3692, 100.5877], "ลพบุรี": [14.7995, 100.6534],
  "สระบุรี": [14.5289, 100.9102], "ชัยนาท": [15.1851, 100.1252], "สิงห์บุรี": [14.8936, 100.3975],
  "นครนายก": [14.2069, 101.2130], "ปราจีนบุรี": [14.0519, 101.3660], "สระแก้ว": [13.8246, 102.0643],
  "ฉะเชิงเทรา": [13.6902, 101.0779], "ชลบุรี": [13.3611, 100.9847], "ระยอง": [12.6814, 101.2816],
  "จันทบุรี": [12.6113, 102.1040], "ตราด": [12.2428, 102.5175],
  "เชียงใหม่": [18.7883, 98.9853], "เชียงราย": [19.9105, 99.8406], "ลำปาง": [18.2888, 99.4927],
  "ลำพูน": [18.5745, 99.0087], "แม่ฮ่องสอน": [19.3020, 97.9654], "พะเยา": [19.1665, 99.9010],
  "น่าน": [18.7756, 100.7730], "แพร่": [18.1445, 100.1403], "อุตรดิตถ์": [17.6200, 100.0993],
  "ตาก": [16.8840, 99.1258], "สุโขทัย": [17.0070, 99.8265], "พิษณุโลก": [16.8211, 100.2659],
  "พิจิตร": [16.4416, 100.3487], "กำแพงเพชร": [16.4827, 99.5226], "นครสวรรค์": [15.7030, 100.1370],
  "อุทัยธานี": [15.3835, 100.0255],
  "ขอนแก่น": [16.4322, 102.8236], "อุดรธานี": [17.4138, 102.7872], "นครราชสีมา": [14.9798, 102.0978],
  "บึงกาฬ": [18.3609, 103.6465], "หนองคาย": [17.8782, 102.7416], "หนองบัวลำภู": [17.2218, 102.4260],
  "เลย": [17.4861, 101.7223], "สกลนคร": [17.1554, 104.1348], "นครพนม": [17.3922, 104.7693],
  "มุกดาหาร": [16.5424, 104.7241], "กาฬสินธุ์": [16.4314, 103.5058], "มหาสารคาม": [16.1851, 103.3008],
  "ร้อยเอ็ด": [16.0538, 103.6520], "ยโสธร": [15.7924, 104.1452], "อำนาจเจริญ": [15.8656, 104.6257],
  "อุบลราชธานี": [15.2287, 104.8563], "ศรีสะเกษ": [15.1199, 104.3220], "สุรินทร์": [14.8820, 103.4937],
  "บุรีรัมย์": [14.9930, 103.1029], "ชัยภูมิ": [15.8068, 102.0318],
  "สุราษฎร์ธานี": [9.1382, 99.3211], "นครศรีธรรมราช": [8.4304, 99.9631], "ภูเก็ต": [7.8804, 98.3923],
  "กระบี่": [8.0863, 98.9063], "พังงา": [8.4509, 98.5255], "ระนอง": [9.9528, 98.6084],
  "ชุมพร": [10.4930, 99.1800], "สงขลา": [7.1756, 100.6142], "สตูล": [6.6238, 100.0674],
  "ตรัง": [7.5593, 99.6114], "พัทลุง": [7.6167, 100.0742], "ปัตตานี": [6.8695, 101.2500],
  "ยะลา": [6.5415, 101.2803], "นราธิวาส": [6.4254, 101.8253],
};

const NAV_TABS = [
  { label: "แผนที่", mode: "browse" as const, icon: MapPin },
  { label: "วางแผนเส้นทาง", mode: "route" as const, icon: Navigation },
];

const NAV_LINKS = [
  { label: "เปรียบเทียบรถ", href: "/cars", icon: Car },
  { label: "คำนวณต้นทุน", href: "/calculator", icon: Calculator },
  { label: "บทความ", href: "/blog", icon: BookOpen },
];

const OPERATORS_LIST = [
  { value: "", label: "ทุกเครือข่าย" },
  { value: "ea-anywhere", label: "EA Anywhere" },
  { value: "ptt-ev", label: "PTT EV" },
  { value: "pluz", label: "EV Station PluZ" },
  { value: "pea-volta", label: "PEA VOLTA" },
  { value: "elexa", label: "EleXA" },
];

const CHARGER_CHIPS = [
  { value: "ac", label: "AC", color: "text-green-600", activeBg: "bg-green-500", dot: "bg-green-500" },
  { value: "dc", label: "DC", color: "text-orange-500", activeBg: "bg-orange-500", dot: "bg-orange-500" },
  { value: "fast", label: "Fast Charge", color: "text-purple-600", activeBg: "bg-purple-500", dot: "bg-purple-500" },
];

export default function EVChargeApp() {
  const searchParams = useSearchParams();
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [focusCoords, setFocusCoords] = useState<[number, number] | undefined>(undefined);
  const [resetView, setResetView] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState<"browse" | "route">(searchParams.get("tab") === "route" ? "route" : "browse");
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeOrigin, setRouteOrigin] = useState<[number, number] | null>(null);
  const [routeDest, setRouteDest] = useState<[number, number] | null>(null);
  const [selectedRouteStation, setSelectedRouteStation] = useState<RouteStation | null>(null);
  const [chargerType, setChargerType] = useState("");
  const [operator, setOperator] = useState(searchParams.get("operator") ?? "");
  const [provinceSearch, setProvinceSearch] = useState("");
  const lastFilter = useRef<FilterState>({ province: "", chargerType: "", operator: "" });

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
    if (filter.operator) params.set("operator", filter.operator);
    try {
      const res = await fetch(`/api/stations?${params}`);
      if (!res.ok) throw new Error();
      const data: Station[] = await res.json();
      setStations(data);
    } catch {
      setError("โหลดข้อมูลไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilter = useCallback((f: FilterState) => {
    lastFilter.current = f;
    const isReset = !f.province && !f.chargerType && !f.operator;
    if (isReset) {
      setFocusCoords(undefined);
      setResetView((v) => !v);
    } else {
      setFocusCoords(f.province ? PROVINCE_COORDS[f.province] : undefined);
      setResetView(false);
    }
    fetchStations(f);
  }, [fetchStations]);

  const handleFilter = useCallback((f: FilterState) => {
    applyFilter(f);
  }, [applyFilter]);

  useEffect(() => {
    const initProvince = searchParams.get("province") ?? "";
    const initOperator = searchParams.get("operator") ?? "";
    if (initProvince) setFocusCoords(PROVINCE_COORDS[initProvince]);
    fetchStations({ province: initProvince, chargerType: "", operator: initOperator });
  }, [fetchStations]);

  const handleSelect = (s: Station) => {
    setSelected(s);
    setPanelOpen(true);
  };
  const handleClose = () => { setSelected(null); setPanelOpen(false); };

  const listOrigin: [number, number] | null =
    userCoords ?? (lastFilter.current.province ? PROVINCE_COORDS[lastFilter.current.province] ?? null : null);

  // status counts for legend
  const statusCounts = stations.reduce(
    (acc, s) => {
      const op = s.StatusType?.IsOperational ?? true;
      if (!op) { acc.offline++; return acc; }
      const mod = s.ID % 5;
      if (mod === 0) acc.full++;
      else if (mod === 1) acc.busy++;
      else acc.available++;
      return acc;
    },
    { available: 0, busy: 0, full: 0, offline: 0 }
  );

  const applyChip = (val: string) => {
    const next = chargerType === val ? "" : val;
    setChargerType(next);
    const province = lastFilter.current.province;
    applyFilter({ province, chargerType: next, operator });
  };

  const applyOperator = (val: string) => {
    setOperator(val);
    const province = lastFilter.current.province;
    applyFilter({ province, chargerType, operator: val });
  };

  const applyProvince = (val: string) => {
    setProvinceSearch(val);
    const matched = val in PROVINCE_COORDS ? val : "";
    applyFilter({ province: matched, chargerType, operator });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-gray-100 z-30 flex-shrink-0">
        {/* Top row */}
        <div className="px-4 py-2.5 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "#00C8FF" }}>
              <Zap size={16} className="text-gray-900" fill="currentColor" />
            </div>
            <div className="leading-none hidden sm:block">
              <p className="font-bold text-sm text-gray-900">EV Charge Map</p>
              <p className="text-[10px] text-gray-400">Thailand</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-sm relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              list="province-list-header"
              type="search"
              value={provinceSearch}
              placeholder="ค้นหาสถานี จังหวัด หรือชื่อสถานี"
              onChange={(e) => applyProvince(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white transition-all"
            />
            <datalist id="province-list-header">
              {Object.keys(PROVINCE_COORDS).map((p) => <option key={p} value={p} />)}
            </datalist>
          </div>

          {/* Nav tabs */}
          <nav className="hidden md:flex items-center gap-0.5 flex-shrink-0">
            {NAV_TABS.map((tab) => (
              <button key={tab.mode}
                onClick={() => {
                  setMode(tab.mode);
                  if (tab.mode === "browse") { setRouteResult(null); setRouteOrigin(null); setRouteDest(null); setSelectedRouteStation(null); }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border-b-2 ${
                  mode === tab.mode
                    ? "text-cyan-600 border-cyan-400 bg-cyan-50"
                    : "text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50"
                }`}>
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-b-2 border-transparent transition-colors">
                <l.icon size={13} />
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0 ml-auto">
            <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
              <User size={16} />
            </button>
            <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
              <Moon size={16} />
            </button>
          </div>
        </div>

        {/* Filter bar — browse mode only */}
        {mode === "browse" && (
          <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            {/* Filter button */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0">
              <Filter size={12} />
              ตัวกรอง
            </button>

            {/* Network dropdown */}
            <select
              value={operator}
              onChange={(e) => applyOperator(e.target.value)}
              className={`py-1.5 pl-2.5 pr-7 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors flex-shrink-0 ${
                operator ? "border-cyan-400 text-cyan-700 font-semibold" : "border-gray-200 text-gray-500"
              }`}
            >
              {OPERATORS_LIST.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

            {/* AC / DC / Fast Charge chips */}
            {CHARGER_CHIPS.map((chip) => (
              <button key={chip.value}
                onClick={() => applyChip(chip.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0 ${
                  chargerType === chip.value
                    ? `${chip.activeBg} text-white border-transparent shadow-sm`
                    : `bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50`
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${chargerType === chip.value ? "bg-white" : chip.dot}`} />
                {chip.label}
              </button>
            ))}

            <span className="text-xs text-gray-400 whitespace-nowrap ml-auto hidden lg:block">
              <span className="font-semibold text-gray-700">{stations.length}</span> สถานี
            </span>
          </div>
        )}
      </header>

      {/* ===== BODY ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map area */}
        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <Map
              stations={mode === "browse" ? stations : []}
              onSelect={handleSelect}
              selected={selected}
              focusCoords={focusCoords}
              resetView={resetView}
              routeResult={routeResult}
              routeOrigin={routeOrigin}
              routeDest={routeDest}
              selectedRouteStation={selectedRouteStation}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3">
                <Loader2 className="animate-spin" size={20} style={{ color: "#00C8FF" }} />
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

          {/* ===== LEFT OVERLAY PANEL ===== */}
          {mode === "browse" && (
            <div className="absolute left-4 top-4 z-20 flex flex-col gap-2.5">
              {/* Status legend */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm px-3.5 py-3 min-w-[145px]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">สถานะสถานี</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      ว่าง
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">{statusCounts.available.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      ใกล้เต็ม
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">{statusCounts.busy.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      เต็ม
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">{statusCounts.full.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      ออฟไลน์
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">{statusCounts.offline.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    if (userCoords) {
                      setFocusCoords(userCoords);
                    } else if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                          setUserCoords(c);
                          setFocusCoords(c);
                        },
                        () => {}
                      );
                    }
                  }}
                  className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:border-cyan-300 hover:text-cyan-700 shadow-sm transition-colors">
                  <LocateFixed size={13} className="text-cyan-500" />
                  ตำแหน่งฉัน
                </button>
                <button
                  onClick={() => {
                    if (listOrigin) setFocusCoords(listOrigin);
                  }}
                  className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:border-cyan-300 hover:text-cyan-700 shadow-sm transition-colors">
                  <Zap size={13} className="text-cyan-500" />
                  สถานีใกล้ฉัน
                </button>
                <button
                  onClick={() => setMode("route")}
                  className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:border-cyan-300 hover:text-cyan-700 shadow-sm transition-colors">
                  <Navigation size={13} className="text-cyan-500" />
                  วางแผนเส้นทาง
                </button>
              </div>
            </div>
          )}

          {/* ===== BOTTOM STATION CARD (desktop) ===== */}
          {selected && (
            <div className="absolute bottom-0 left-0 right-0 z-30 md:bottom-4 md:left-4 md:right-auto md:w-[580px] xl:w-[640px]">
              {/* Mobile: slide-up sheet */}
              <div className={`md:hidden bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${panelOpen ? "translate-y-0" : "translate-y-full"}`}>
                <div className="flex justify-center pt-3 pb-1">
                  <button onClick={() => setPanelOpen(!panelOpen)} className="text-gray-300">
                    <ChevronDown size={24} />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[75vh]">
                  {/* Import StationCard inline for mobile */}
                  <BottomCardInline station={selected} onClose={handleClose} />
                </div>
              </div>

              {/* Desktop: floating card */}
              <div className="hidden md:block rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <BottomCardInline station={selected} onClose={handleClose} />
              </div>
            </div>
          )}

          {/* Mobile FAB */}
          {selected && !panelOpen && (
            <button className="md:hidden absolute bottom-4 right-4 z-30 bg-white rounded-full shadow-lg p-3"
              onClick={() => setPanelOpen(true)}>
              <Zap size={20} style={{ color: "#00C8FF" }} />
            </button>
          )}
        </main>

        {/* Sidebar */}
        {mode === "browse" ? (
          <StationList
            stations={stations}
            userCoords={listOrigin}
            selected={selected}
            onSelect={handleSelect}
            onClose={handleClose}
          />
        ) : (
          <RoutePlanner
            onResult={(result, origin, dest) => {
              setRouteResult(result);
              setRouteOrigin(origin);
              setRouteDest(dest);
              setSelectedRouteStation(null);
            }}
            onStationSelect={setSelectedRouteStation}
            initialOrigin={searchParams.get("from") ?? ""}
            initialDest={searchParams.get("to") ?? ""}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-5 py-2 flex items-center justify-between flex-shrink-0">
        <p className="text-[10px] text-gray-400">© 2026 EV Charge Map Thailand</p>
        <p className="text-[10px] text-gray-400">
          ข้อมูลจาก{" "}
          <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer"
            className="hover:text-cyan-600 underline transition-colors">
            OpenStreetMap
          </a>
        </p>
      </footer>
    </div>
  );
}

// Inline bottom card component (avoids circular import)
import StationCardComponent from "./StationCard";
function BottomCardInline({ station, onClose }: { station: Station; onClose: () => void }) {
  return <StationCardComponent station={station} onClose={onClose} />;
}
