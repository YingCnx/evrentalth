"use client";

import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

export type FilterState = {
  province: string;
  chargerType: string;
};

const PROVINCES = [
  "กรุงเทพมหานคร", "เชียงใหม่", "ภูเก็ต", "ชลบุรี", "ขอนแก่น",
  "นครราชสีมา", "เชียงราย", "อุดรธานี", "สุราษฎร์ธานี", "นครศรีธรรมราช",
  "หาดใหญ่", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ",
];

const CHARGER_TYPES = [
  { value: "", label: "ทุกประเภท" },
  { value: "ac", label: "AC" },
  { value: "dc", label: "DC" },
  { value: "fast", label: "Fast 50kW+" },
];

type Props = {
  onFilter: (f: FilterState) => void;
  stationCount: number;
};

export default function SearchFilter({ onFilter, stationCount }: Props) {
  const [province, setProvince] = useState("");
  const [chargerType, setChargerType] = useState("");

  const apply = (p = province, c = chargerType) => onFilter({ province: p, chargerType: c });

  const reset = () => {
    setProvince("");
    setChargerType("");
    onFilter({ province: "", chargerType: "" });
  };

  const hasFilter = province || chargerType;

  return (
    <div className="flex items-center gap-2">
      {/* Province select */}
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select
          value={province}
          onChange={(e) => { setProvince(e.target.value); apply(e.target.value, chargerType); }}
          className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 cursor-pointer"
          aria-label="เลือกจังหวัด"
        >
          <option value="">ทุกจังหวัด</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Charger type pills — "ทุกประเภท" highlights when no filter */}
      <div className="flex items-center gap-1">
        {CHARGER_TYPES.map((t) => {
          const isActive = chargerType === t.value;
          return (
            <button
              key={t.value}
              onClick={() => { setChargerType(t.value); apply(province, t.value); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Station count */}
      <span className="text-xs text-gray-400 whitespace-nowrap hidden lg:block">
        <span className="font-semibold text-gray-700">{stationCount}</span> สถานี
      </span>

      {/* Clear — only show when non-default filter active */}
      {hasFilter && (
        <button
          onClick={reset}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="ล้างตัวกรอง"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
