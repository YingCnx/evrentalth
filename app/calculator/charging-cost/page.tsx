"use client";

import { useState } from "react";
import { Zap, Battery, Fuel } from "lucide-react";
import Link from "next/link";
import { EV_CARS } from "../../lib/cars";
import { CHARGER_NETWORKS } from "../../lib/chargers";
import PageLayout from "../../components/PageLayout";

export default function ChargingCostPage() {
  const [carId, setCarId] = useState("byd-dolphin");
  const [networkId, setNetworkId] = useState("ea-anywhere");
  const [chargePercent, setChargePercent] = useState(80);
  const [startPercent, setStartPercent] = useState(10);

  const car = EV_CARS.find(c => c.id === carId)!;
  const network = CHARGER_NETWORKS.find(n => n.id === networkId)!;

  const kwhNeeded = (car.batteryKwh * (chargePercent - startPercent)) / 100;
  const cost = network.pricePerKwh ? kwhNeeded * network.pricePerKwh : null;
  const rangeAdded = (kwhNeeded / car.batteryKwh) * car.rangeKm;
  const timeMin = Math.round((kwhNeeded / Math.max(...network.dcKw)) * 60);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">คำนวณค่าชาร์จต่อครั้ง</h1>
          <p className="text-gray-500">เลือกรถและเครือข่ายชาร์จ แล้วดูค่าใช้จ่ายที่แม่นยำ</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">รถ EV ของคุณ</label>
            <select value={carId} onChange={e => setCarId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
              {EV_CARS.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.batteryKwh} kWh)</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">เครือข่ายชาร์จ</label>
            <select value={networkId} onChange={e => setNetworkId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
              {CHARGER_NETWORKS.map(n => <option key={n.id} value={n.id}>{n.name} — {n.priceNote}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-600">แบตเริ่มต้น</label>
                <span className="text-sm font-black">{startPercent}%</span>
              </div>
              <input type="range" min={0} max={50} step={5} value={startPercent}
                onChange={e => setStartPercent(Math.min(+e.target.value, chargePercent - 10))}
                className="w-full accent-red-400" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-600">ชาร์จถึง</label>
                <span className="text-sm font-black">{chargePercent}%</span>
              </div>
              <input type="range" min={50} max={100} step={5} value={chargePercent}
                onChange={e => setChargePercent(Math.max(+e.target.value, startPercent + 10))}
                className="w-full accent-green-500" />
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Zap, label: "พลังงานที่เติม", value: `${kwhNeeded.toFixed(1)} kWh`, color: "bg-blue-50 text-blue-700" },
            { icon: Battery, label: "ค่าชาร์จ", value: cost ? `${cost.toFixed(0)} ฿` : "แล้วแต่เวลา", color: "bg-green-50 text-green-700" },
            { icon: Battery, label: "ระยะทางที่ได้", value: `+${rangeAdded.toFixed(0)} กม.`, color: "bg-purple-50 text-purple-700" },
            { icon: Zap, label: "เวลาชาร์จ (DC)", value: `~${timeMin} นาที`, color: "bg-orange-50 text-orange-700" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-4 text-center ${s.color}`}>
              <p className="text-xs font-medium mb-1 opacity-70">{s.label}</p>
              <p className="text-xl font-black">{s.value}</p>
            </div>
          ))}
        </div>

        {cost && (
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <p className="font-black text-gray-900 mb-3">เทียบกับรถน้ำมัน ({rangeAdded.toFixed(0)} กม.)</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center bg-white rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Fuel size={11} /> น้ำมัน (42฿/ล., 12กม./ล.)</p>
                <p className="text-xl font-black text-red-500">{((rangeAdded / 12) * 42).toFixed(0)} ฿</p>
              </div>
              <div className="text-green-600 font-black">VS</div>
              <div className="flex-1 text-center bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Zap size={11} /> {network.name}</p>
                <p className="text-xl font-black text-green-600">{cost.toFixed(0)} ฿</p>
              </div>
            </div>
            <p className="text-center text-sm font-bold text-green-700 mt-3">
              ประหยัดได้ {(((rangeAdded / 12) * 42) - cost).toFixed(0)} ฿ ({Math.round(((((rangeAdded / 12) * 42) - cost) / ((rangeAdded / 12) * 42)) * 100)}%)
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/calculator" className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm">
            คำนวณคืนทุน EV
          </Link>
          <Link href="/chargers/pricing" className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold py-3.5 rounded-2xl transition-colors text-sm">
            เปรียบเทียบค่าบริการ
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
