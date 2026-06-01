"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

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
  const [inputValue, setInputValue] = useState("");
  const [chargerType, setChargerType] = useState("");

  const applyProvince = (val: string) => {
    // Only trigger search when value exactly matches a province or is empty
    const matched = PROVINCES.includes(val) ? val : "";
    onFilter({ province: matched, chargerType });
  };

  const apply = (p: string, c: string) => onFilter({ province: p, chargerType: c });

  const reset = () => {
    setInputValue("");
    setChargerType("");
    onFilter({ province: "", chargerType: "" });
  };

  const hasFilter = inputValue || chargerType;

  return (
    <div className="flex items-center gap-2">
      {/* Province — native datalist สำหรับ Thai IME support */}
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          list="province-list"
          type="search"
          value={inputValue}
          placeholder="ค้นหาจังหวัด..."
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            applyProvince(val);
          }}
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          aria-label="ค้นหาจังหวัด"
          autoComplete="off"
        />
        <datalist id="province-list">
          {PROVINCES.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </div>

      {/* Charger type pills */}
      <div className="flex items-center gap-1">
        {CHARGER_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setChargerType(t.value);
              const matched = PROVINCES.includes(inputValue) ? inputValue : "";
              apply(matched, t.value);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chargerType === t.value
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <span className="text-xs text-gray-400 whitespace-nowrap hidden lg:block">
        <span className="font-semibold text-gray-700">{stationCount}</span> สถานี
      </span>

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
