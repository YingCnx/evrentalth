"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Zap, Car, ChevronRight, PartyPopper, Fuel } from "lucide-react";
import Link from "next/link";
import { EV_CARS, formatPrice } from "../lib/cars";

export default function CalculatorClient() {
  const [kmPerDay, setKmPerDay] = useState(80);
  const [fuelPrice, setFuelPrice] = useState(42);
  const [fuelEfficiency, setFuelEfficiency] = useState(12);
  const [evCarId, setEvCarId] = useState("byd-dolphin");
  const [electricityPrice, setElectricityPrice] = useState(7);

  const car = EV_CARS.find(c => c.id === evCarId)!;
  const kmPerMonth = kmPerDay * 30;
  const fuelCostPerMonth = (kmPerMonth / fuelEfficiency) * fuelPrice;
  const evKwhPer100Km = (car.batteryKwh / car.rangeKm) * 100;
  const evCostPerMonth = (evKwhPer100Km / 100) * electricityPrice * kmPerMonth;
  const savingPerMonth = fuelCostPerMonth - evCostPerMonth;
  const savingPerYear = savingPerMonth * 12;
  const paybackYears = car.priceMin / savingPerYear;
  const savingPercent = Math.round((savingPerMonth / fuelCostPerMonth) * 100);

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">คำนวณความคุ้มค่า EV vs น้ำมัน</h1>
        <p className="text-gray-500">ใส่ข้อมูลการใช้รถของคุณ แล้วดูว่าซื้อ EV คืนทุนกี่ปี</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2"><Car size={16} className="text-gray-500" />พฤติกรรมการขับ</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm text-gray-600 font-medium">ระยะทางต่อวัน</label>
                  <span className="text-sm font-black text-gray-900">{kmPerDay} กม.</span>
                </div>
                <input type="range" min={20} max={300} step={10} value={kmPerDay}
                  onChange={e => setKmPerDay(+e.target.value)} className="w-full accent-green-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>20</span><span>300 กม.</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm text-gray-600 font-medium">ราคาน้ำมัน (บาท/ลิตร)</label>
                  <span className="text-sm font-black text-gray-900">{fuelPrice} ฿</span>
                </div>
                <input type="range" min={30} max={60} step={1} value={fuelPrice}
                  onChange={e => setFuelPrice(+e.target.value)} className="w-full accent-orange-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm text-gray-600 font-medium">อัตราสิ้นเปลือง (กม./ลิตร)</label>
                  <span className="text-sm font-black text-gray-900">{fuelEfficiency} กม./ล.</span>
                </div>
                <input type="range" min={8} max={20} step={1} value={fuelEfficiency}
                  onChange={e => setFuelEfficiency(+e.target.value)} className="w-full accent-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2"><Zap size={16} className="text-green-500" />รถ EV ที่สนใจ</h2>
            <select value={evCarId} onChange={e => setEvCarId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-1 focus:ring-green-500">
              {EV_CARS.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} — {formatPrice(c.priceMin)}</option>)}
            </select>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm text-gray-600 font-medium">ค่าไฟฟ้า (บาท/kWh)</label>
                <span className="text-sm font-black text-gray-900">{electricityPrice} ฿</span>
              </div>
              <input type="range" min={4} max={10} step={0.5} value={electricityPrice}
                onChange={e => setElectricityPrice(+e.target.value)} className="w-full accent-green-500" />
              <p className="text-xs text-gray-400 mt-1">บ้าน ~4-5 ฿ · สาธารณะ ~7-9 ฿/kWh</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center ${paybackYears <= 5 ? "bg-green-500 text-white" : paybackYears <= 8 ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
            <p className="text-sm opacity-70 mb-1">คืนทุนภายใน</p>
            <p className="text-5xl font-black mb-1">{paybackYears.toFixed(1)}</p>
            <p className="text-lg opacity-80">ปี</p>
            {paybackYears <= 5 && <p className="text-sm mt-2 opacity-90 flex items-center justify-center gap-1"><PartyPopper size={14} /> คุ้มมากๆ!</p>}
            {paybackYears > 5 && paybackYears <= 8 && <p className="text-sm mt-2 opacity-70">คุ้มในระยะกลาง</p>}
            {paybackYears > 8 && <p className="text-sm mt-2 opacity-60">ขับเยอะขึ้นจะคืนทุนเร็วขึ้น</p>}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="font-black text-gray-900 mb-4">เปรียบเทียบต่อเดือน ({(kmPerMonth).toLocaleString()} กม.)</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-1"><Fuel size={13} /> รถน้ำมัน</span>
                <span className="font-black text-red-500">{fuelCostPerMonth.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-1"><Zap size={13} /> {car.brand} {car.model}</span>
                <span className="font-black text-green-600">{evCostPerMonth.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">ประหยัดต่อเดือน</span>
                <span className="font-black text-green-600 text-lg">{savingPerMonth.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿</span>
              </div>
              <div className="bg-green-50 rounded-xl px-3 py-2 text-center">
                <p className="text-sm font-bold text-green-700">ประหยัดกว่า {savingPercent}% ต่อเดือน</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="font-black text-gray-900 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-green-500" />ประหยัดได้ในระยะยาว</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[1, 3, 5].map(yr => (
                <div key={yr} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{yr} ปี</p>
                  <p className="text-sm font-black text-gray-900">{(savingPerYear * yr / 1000).toFixed(0)}K ฿</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/cars/${evCarId}`}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
              ดูสเปค {car.brand} {car.model} <ChevronRight size={14} />
            </Link>
            <Link href="/calculator/charging-cost"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm">
              คำนวณค่าชาร์จ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
