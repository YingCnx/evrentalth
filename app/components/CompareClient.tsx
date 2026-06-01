"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Battery, Zap, Clock, Check, X, ArrowLeft } from "lucide-react";
import { EV_CARS, formatPrice } from "../lib/cars";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialCars = searchParams.get("cars")?.split(",").filter(Boolean) ?? [];
  const [selected, setSelected] = useState<string[]>(initialCars.slice(0, 3));

  const cars = EV_CARS.filter(c => selected.includes(c.id));

  const SPECS = [
    { label: "ราคาเริ่มต้น", key: "priceMin" as const, format: (v: number) => formatPrice(v), better: "lower" },
    { label: "ระยะทาง (กม.)", key: "rangeKm" as const, format: (v: number) => `${v} กม.`, better: "higher" },
    { label: "แบตเตอรี่ (kWh)", key: "batteryKwh" as const, format: (v: number) => `${v} kWh`, better: "higher" },
    { label: "DC Charge (kW)", key: "chargeDcKw" as const, format: (v: number) => `${v} kW`, better: "higher" },
    { label: "AC Charge (kW)", key: "chargeAcKw" as const, format: (v: number) => `${v} kW`, better: "higher" },
    { label: "ชาร์จ 10-80% (นาที)", key: "charge10to80Min" as const, format: (v: number) => `${v} นาที`, better: "lower" },
    { label: "ที่นั่ง", key: "seats" as const, format: (v: number) => `${v} ที่นั่ง`, better: "none" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft size={15} />กลับหน้าเปรียบเทียบรถ
      </Link>
      <h1 className="text-3xl font-black text-gray-900 mb-2">เปรียบเทียบรถ EV</h1>
      <p className="text-gray-500 mb-8">เลือกรถสูงสุด 3 รุ่น เปรียบเทียบสเปคเคียงข้างกัน</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="border-2 border-dashed border-gray-200 rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center">
            {selected[i] ? (() => {
              const car = EV_CARS.find(c => c.id === selected[i]);
              if (!car) return null;
              return (
                <div className="text-center w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl font-black text-gray-300">{car.brand[0]}</div>
                  <p className="text-xs text-green-600 font-bold">{car.brand}</p>
                  <p className="text-sm font-black text-gray-900">{car.model}</p>
                  <button onClick={() => setSelected(prev => prev.filter((_, idx) => idx !== i))}
                    className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto">
                    <X size={11} />ลบออก
                  </button>
                </div>
              );
            })() : (
              <select onChange={e => {
                if (!e.target.value) return;
                setSelected(prev => { const n = [...prev]; n[i] = e.target.value; return n; });
              }} className="text-xs border border-gray-200 rounded-xl px-2 py-1.5 text-gray-500 w-full">
                <option value="">+ เพิ่มรถ</option>
                {EV_CARS.filter(c => !selected.includes(c.id)).map(c => (
                  <option key={c.id} value={c.id}>{c.brand} {c.model}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {cars.length >= 2 ? (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
            <div className="p-4 bg-gray-50" />
            {cars.map(car => (
              <div key={car.id} className="p-4 text-center border-l border-gray-100">
                <p className="text-xs text-green-600 font-bold">{car.brand}</p>
                <Link href={`/cars/${car.id}`} className="font-black text-gray-900 hover:text-green-600 transition-colors">{car.model}</Link>
              </div>
            ))}
          </div>

          {SPECS.map(spec => {
            const vals = cars.map(c => c[spec.key] as number);
            const best = spec.better === "higher" ? Math.max(...vals) : spec.better === "lower" ? Math.min(...vals) : null;
            return (
              <div key={spec.key} className="grid border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
                <div className="p-4 flex items-center"><span className="text-xs font-semibold text-gray-600">{spec.label}</span></div>
                {cars.map(car => {
                  const val = car[spec.key] as number;
                  const isBest = best !== null && val === best;
                  return (
                    <div key={car.id} className={`p-4 text-center border-l border-gray-100 flex items-center justify-center ${isBest ? "bg-green-50" : ""}`}>
                      <span className={`text-sm font-bold ${isBest ? "text-green-700" : "text-gray-700"}`}>
                        {spec.format(val)}{isBest && <Check size={12} className="inline ml-1 text-green-500" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="grid border-b border-gray-50" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
            <div className="p-4 flex items-center"><span className="text-xs font-semibold text-gray-600">ขับ Grab</span></div>
            {cars.map(car => (
              <div key={car.id} className="p-4 text-center border-l border-gray-100 flex items-center justify-center">
                {car.grabFriendly
                  ? <span className="flex items-center gap-1 text-green-600 text-sm font-bold"><Check size={14} />เหมาะสม</span>
                  : <span className="flex items-center gap-1 text-gray-400 text-sm"><X size={14} />ไม่เหมาะ</span>}
              </div>
            ))}
          </div>

          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
            <div className="p-4" />
            {cars.map(car => (
              <div key={car.id} className="p-4 border-l border-gray-100 space-y-2">
                <Link href={`/cars/${car.id}`}
                  className="block text-center bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                  ดูสเปคเต็ม
                </Link>
                <Link href={`/calculator?car=${car.id}`}
                  className="block text-center border border-gray-200 hover:border-green-300 text-gray-600 text-xs font-medium py-2 rounded-xl transition-colors">
                  คำนวณคืนทุน
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          <Battery size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">เลือกรถอย่างน้อย 2 รุ่นเพื่อเปรียบเทียบ</p>
        </div>
      )}
    </div>
  );
}

export default function CompareClient() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-400">กำลังโหลด...</div>}>
      <CompareContent />
    </Suspense>
  );
}
