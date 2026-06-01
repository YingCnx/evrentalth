"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export type FilterState = {
  province: string;
  chargerType: string; // "" | "ac" | "dc" | "fast"
};

const PROVINCES = [
  "กรุงเทพมหานคร", "เชียงใหม่", "ภูเก็ต", "ชลบุรี", "ขอนแก่น",
  "นครราชสีมา", "เชียงราย", "อุดรธานี", "สุราษฎร์ธานี", "นครศรีธรรมราช",
  "หาดใหญ่", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ",
];

const CHARGER_TYPES = [
  { value: "", label: "ทุกประเภท / All Types" },
  { value: "ac", label: "AC (Type 1 / Type 2)" },
  { value: "dc", label: "DC (CHAdeMO / CCS)" },
  { value: "fast", label: "Fast Charge (50kW+)" },
];

type Props = {
  onFilter: (f: FilterState) => void;
  stationCount: number;
};

export default function SearchFilter({ onFilter, stationCount }: Props) {
  const [province, setProvince] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [open, setOpen] = useState(false);

  const apply = (p = province, c = chargerType) => {
    onFilter({ province: p, chargerType: c });
    setOpen(false);
  };

  const reset = () => {
    setProvince("");
    setChargerType("");
    onFilter({ province: "", chargerType: "" });
  };

  const hasFilter = province || chargerType;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={province}
            onChange={(e) => { setProvince(e.target.value); apply(e.target.value, chargerType); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none cursor-pointer"
            aria-label="ค้นหาตามจังหวัด"
          >
            <option value="">ทุกจังหวัด / All Provinces</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`p-2.5 rounded-xl border transition-colors ${open ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600 hover:border-green-400"}`}
          aria-label="ตัวกรอง"
        >
          <SlidersHorizontal size={18} />
        </button>

        {hasFilter && (
          <button
            onClick={reset}
            className="p-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
            aria-label="ล้างตัวกรอง"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Charger type filter */}
      {open && (
        <div className="flex flex-wrap gap-2 pt-1">
          {CHARGER_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => { setChargerType(t.value); apply(province, t.value); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                chargerType === t.value
                  ? "bg-green-500 text-white border-green-500"
                  : "border-gray-200 text-gray-600 hover:border-green-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Station count */}
      <p className="text-xs text-gray-400">
        พบ <span className="font-semibold text-green-600">{stationCount}</span> สถานี
        {province && ` ใน${province}`}
        {" "}/ Found <span className="font-semibold text-green-600">{stationCount}</span> stations
        {province && ` in ${province}`}
      </p>
    </div>
  );
}
