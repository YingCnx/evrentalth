"use client";

import { useState, useRef, useEffect } from "react";
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
  const [province, setProvince] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = inputValue.trim()
    ? PROVINCES.filter((p) => p.includes(inputValue.trim()))
    : PROVINCES;

  const apply = (p: string, c = chargerType) => onFilter({ province: p, chargerType: c });

  const selectProvince = (p: string) => {
    setProvince(p);
    setInputValue(p);
    setOpen(false);
    setHighlighted(-1);
    apply(p, chargerType);
  };

  const clearProvince = () => {
    setProvince("");
    setInputValue("");
    setOpen(false);
    apply("", chargerType);
    inputRef.current?.focus();
  };

  const reset = () => {
    setProvince("");
    setInputValue("");
    setChargerType("");
    setOpen(false);
    onFilter({ province: "", chargerType: "" });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        // If user typed but didn't pick, revert to last confirmed province
        if (!province) setInputValue("");
        else setInputValue(province);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [province]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (highlighted >= 0 && suggestions[highlighted]) selectProvince(suggestions[highlighted]); }
    else if (e.key === "Escape") { setOpen(false); setHighlighted(-1); }
  };

  const hasFilter = province || chargerType;

  return (
    <div className="flex items-center gap-2">
      {/* Province combobox */}
      <div ref={wrapperRef} className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder="ค้นหาจังหวัด..."
          onChange={(e) => { setInputValue(e.target.value); setOpen(true); setHighlighted(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          aria-label="ค้นหาจังหวัด"
          autoComplete="off"
        />
        {inputValue && (
          <button
            onMouseDown={(e) => { e.preventDefault(); clearProvince(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={13} />
          </button>
        )}

        {/* Dropdown */}
        {open && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[1000] overflow-hidden max-h-52 overflow-y-auto">
            {suggestions.map((p, i) => (
              <li key={p}>
                <button
                  onMouseDown={(e) => { e.preventDefault(); selectProvince(p); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    i === highlighted
                      ? "bg-green-50 text-green-700"
                      : p === province
                      ? "bg-gray-50 text-gray-800 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Charger type pills */}
      <div className="flex items-center gap-1">
        {CHARGER_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => { setChargerType(t.value); apply(province, t.value); }}
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
        <button onClick={reset} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="ล้างตัวกรอง">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
