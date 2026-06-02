"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Battery, Clock, ChevronRight, Filter, ArrowUpDown, Car as CarIcon, Check } from "lucide-react";
import { EV_CARS, BRANDS, SEGMENTS, formatPrice, type EVCar } from "../lib/cars";

type SortKey = "priceMin" | "rangeKm" | "chargeDcKw" | "charge10to80Min";

const SORT_LABELS: Record<SortKey, string> = {
  priceMin: "ราคา",
  rangeKm: "ระยะทาง",
  chargeDcKw: "ชาร์จเร็ว",
  charge10to80Min: "เวลาชาร์จ",
};

export default function CarsPage() {
  const [brand, setBrand] = useState("ทั้งหมด");
  const [segment, setSegment] = useState<EVCar["segment"] | "ทั้งหมด">("ทั้งหมด");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [sortBy, setSortBy] = useState<SortKey>("priceMin");
  const [selected, setSelected] = useState<EVCar[]>([]);
  const [activeCar, setActiveCar] = useState<EVCar | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered = useMemo(() => {
    return EV_CARS
      .filter(c => brand === "ทั้งหมด" || c.brand === brand)
      .filter(c => segment === "ทั้งหมด" || c.segment === segment)
      .filter(c => c.priceMin <= maxPrice)
      .sort((a, b) => sortBy === "charge10to80Min"
        ? a[sortBy] - b[sortBy]
        : sortBy === "rangeKm" || sortBy === "chargeDcKw"
        ? b[sortBy] - a[sortBy]
        : a[sortBy] - b[sortBy]);
  }, [brand, segment, maxPrice, sortBy]);

  const toggleCompare = (car: EVCar) => {
    setSelected(prev =>
      prev.find(c => c.id === car.id)
        ? prev.filter(c => c.id !== car.id)
        : prev.length < 3 ? [...prev, car] : prev
    );
  };

  useEffect(() => {
    if (filtered.length > 0 && !activeCar) setActiveCar(filtered[0]);
  }, [filtered, activeCar]);

  const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { car: EVCar; ratio: number } | null = null;
        entries.forEach((entry) => {
          const car = filtered.find((c) => c.id === entry.target.getAttribute("data-car-id"));
          if (car && entry.intersectionRatio > (best?.ratio ?? 0)) {
            best = { car, ratio: entry.intersectionRatio };
          }
        });
        if (best) setActiveCar((best as { car: EVCar }).car);
      },
      { threshold: [0.3, 0.6, 1.0], rootMargin: "-10% 0px -30% 0px" }
    );
    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-sm text-gray-900">EV Charge Map</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-600 font-medium">เปรียบเทียบรถ EV</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">เปรียบเทียบรถ EV ในไทย</h1>
          <p className="text-gray-500">{EV_CARS.length} รุ่น จาก {BRANDS.length} แบรนด์ — อัปเดต 2024</p>
        </div>

        {/* Compare bar */}
        {selected.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-blue-700">เปรียบเทียบ ({selected.length}/3):</span>
            {selected.map(c => (
              <span key={c.id} className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-sm">
                {c.brand} {c.model}
                <button onClick={() => toggleCompare(c)} className="text-blue-400 hover:text-blue-600 ml-1">×</button>
              </span>
            ))}
            {selected.length >= 2 && (
              <button className="ml-auto bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                เปรียบเทียบเลย →
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">กรองและเรียง</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Brand */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">แบรนด์</label>
              <select value={brand} onChange={e => setBrand(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500">
                <option>ทั้งหมด</option>
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            {/* Segment */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">ประเภท</label>
              <select value={segment} onChange={e => setSegment(e.target.value as EVCar["segment"] | "ทั้งหมด")}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500">
                <option value="ทั้งหมด">ทั้งหมด</option>
                {Object.entries(SEGMENTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {/* Price */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">
                ราคาไม่เกิน — <span className="text-gray-800 font-bold">{formatPrice(maxPrice)}</span>
              </label>
              <input type="range" min={500000} max={5000000} step={100000} value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="w-full accent-green-500 cursor-pointer" />
            </div>
            {/* Sort */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">เรียงตาม</label>
              <div className="flex gap-1.5 flex-wrap">
                {(Object.keys(SORT_LABELS) as SortKey[]).map(k => (
                  <button key={k} onClick={() => setSortBy(k)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      sortBy === k ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {SORT_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">พบ <span className="font-bold text-gray-900">{filtered.length}</span> รุ่น</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <ArrowUpDown size={12} />เรียงตาม{SORT_LABELS[sortBy]}
          </div>
        </div>

        {/* Car Grid + Sticky Panel */}
        <div className="flex gap-6 items-start">

          {/* Sticky image panel — desktop only */}
          <div className="hidden xl:block w-72 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center">
                {activeCar?.imageUrl ? (
                  <Image
                    key={activeCar.id}
                    src={activeCar.imageUrl}
                    alt={`${activeCar?.brand} ${activeCar?.model}`}
                    fill
                    className="object-contain p-6 transition-opacity duration-300"
                    sizes="288px"
                  />
                ) : (
                  <div className="text-6xl font-black text-gray-200">{activeCar?.brand?.[0]}</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-cyan-600 font-bold mb-0.5">{activeCar?.brand}</p>
                <p className="text-lg font-black text-gray-900 leading-tight">{activeCar?.model}</p>
                <p className="text-xs text-gray-400 mt-0.5 mb-3">{activeCar?.highlight}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center bg-cyan-50 rounded-xl p-2">
                    <Battery size={12} className="text-cyan-600 mx-auto mb-0.5" />
                    <p className="text-[11px] font-bold text-gray-800">{activeCar?.rangeKm}</p>
                    <p className="text-[9px] text-gray-400">กม.</p>
                  </div>
                  <div className="text-center bg-cyan-50 rounded-xl p-2">
                    <Zap size={12} className="text-cyan-600 mx-auto mb-0.5" />
                    <p className="text-[11px] font-bold text-gray-800">{activeCar?.chargeDcKw}</p>
                    <p className="text-[9px] text-gray-400">kW DC</p>
                  </div>
                  <div className="text-center bg-cyan-50 rounded-xl p-2">
                    <Clock size={12} className="text-cyan-600 mx-auto mb-0.5" />
                    <p className="text-[11px] font-bold text-gray-800">{activeCar?.charge10to80Min}</p>
                    <p className="text-[9px] text-gray-400">นาที</p>
                  </div>
                </div>
                <p className="text-base font-black text-gray-900">{activeCar ? formatPrice(activeCar.priceMin) : ""}</p>
                <p className="text-[10px] text-gray-400">บาท</p>
                {activeCar && (
                  <Link href={`/cars/${activeCar.id}`}
                    className="mt-3 w-full flex items-center justify-center gap-1 bg-cyan-400 hover:bg-cyan-300 text-gray-900 text-xs font-bold py-2.5 rounded-xl transition-colors">
                    ดูรายละเอียด <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(car => {
            const isSelected = selected.find(c => c.id === car.id);
            return (
              <div key={car.id}
                ref={(el) => setCardRef(car.id, el)}
                data-car-id={car.id}
                className={`bg-white rounded-2xl border-2 transition-all ${
                  isSelected ? "border-cyan-400 shadow-cyan-100 shadow-lg" : "border-gray-100 hover:border-cyan-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,200,255,0.12)]"
                }`}>
                {/* Car image */}
                <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                  {car.imageUrl ? (
                    <Image src={car.imageUrl} alt={`${car.brand} ${car.model}`} fill className="object-contain p-4" sizes="320px" />
                  ) : (
                    <div className="text-5xl font-black text-gray-200">{car.brand[0]}</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold bg-white/90 text-gray-600 px-2 py-1 rounded-lg">
                      {SEGMENTS[car.segment]}
                    </span>
                  </div>
                  {car.grabFriendly && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-1 rounded-lg">
                        <CarIcon size={10} className="inline mr-0.5" /> Grab OK
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Brand + Model */}
                  <div className="mb-3">
                    <p className="text-xs text-green-600 font-bold">{car.brand}</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">{car.model}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{car.highlight}</p>
                  </div>

                  {/* Price */}
                  <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3">
                    <p className="text-xs text-gray-400">ราคา</p>
                    <p className="text-lg font-black text-gray-900">
                      {formatPrice(car.priceMin)}
                      {car.priceMax !== car.priceMin && <span className="text-sm font-normal text-gray-400"> – {formatPrice(car.priceMax)}</span>}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-green-50 rounded-xl p-2">
                      <Battery size={13} className="text-green-600 mx-auto mb-0.5" />
                      <p className="text-[11px] font-bold text-gray-800">{car.rangeKm}</p>
                      <p className="text-[10px] text-gray-400">กม.</p>
                    </div>
                    <div className="text-center bg-blue-50 rounded-xl p-2">
                      <Zap size={13} className="text-blue-600 mx-auto mb-0.5" />
                      <p className="text-[11px] font-bold text-gray-800">{car.chargeDcKw}</p>
                      <p className="text-[10px] text-gray-400">kW DC</p>
                    </div>
                    <div className="text-center bg-orange-50 rounded-xl p-2">
                      <Clock size={13} className="text-orange-500 mx-auto mb-0.5" />
                      <p className="text-[11px] font-bold text-gray-800">{car.charge10to80Min}</p>
                      <p className="text-[10px] text-gray-400">นาที</p>
                    </div>
                  </div>

                  {/* Connectors */}
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {car.connectors.map(c => (
                      <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium">{c}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCompare(car)}
                      className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}>
                      {isSelected ? <><Check size={11} className="inline mr-0.5" /> เลือกแล้ว</> : "+ เปรียบเทียบ"}
                    </button>
                    <Link href="/map"
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                      หาจุดชาร์จ <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <Battery size={40} className="mx-auto mb-3 opacity-30" />
              <p>ไม่พบรถที่ตรงกับเงื่อนไข</p>
            </div>
          )}
          </div>{/* end grid */}
        </div>{/* end flex */}
      </div>
    </div>
  );
}
