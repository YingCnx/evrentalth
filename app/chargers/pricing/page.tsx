import { Metadata } from "next";
import Link from "next/link";
import { Zap, ChevronRight, Trophy } from "lucide-react";
import { CHARGER_NETWORKS } from "../../lib/chargers";
import PageLayout from "../../components/PageLayout";

export const metadata: Metadata = {
  title: "เปรียบเทียบค่าชาร์จ EV ทุกเครือข่ายในไทย 2026 | EV Charge Map",
  description: "ตารางค่าบริการชาร์จรถ EV ทุกเครือข่าย EA Anywhere, PTT EV, Sharge, Plugify อัปเดต 2026 คำนวณค่าใช้จ่ายต่อการชาร์จ 1 ครั้ง",
};

const EXAMPLE_KWH = 60;

export default function PricingPage() {
  const sorted = [...CHARGER_NETWORKS].sort((a, b) => (a.pricePerKwh ?? 99) - (b.pricePerKwh ?? 99));

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">เปรียบเทียบค่าชาร์จ EV ทุกเครือข่าย</h1>
          <p className="text-gray-500">อัปเดต มิถุนายน 2026 · คำนวณจากแบตขนาด {EXAMPLE_KWH} kWh (เช่น BYD Seal, Tesla Model 3)</p>
        </div>

        {/* Quick summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {sorted.slice(0, 4).map((n, i) => (
            <div key={n.id} className={`rounded-2xl p-4 text-center ${i === 0 ? "bg-green-500 text-white" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold mb-1 flex items-center justify-center gap-1 ${i === 0 ? "text-green-100" : "text-gray-400"}`}>{i === 0 ? <><Trophy size={11} /> ถูกที่สุด</> : `อันดับ ${i + 1}`}</p>
              <p className={`font-black text-sm ${i === 0 ? "text-white" : "text-gray-900"}`}>{n.name}</p>
              <p className={`text-xl font-black ${i === 0 ? "text-white" : "text-gray-900"}`}>{n.pricePerKwh ?? "-"}</p>
              <p className={`text-xs ${i === 0 ? "text-green-100" : "text-gray-400"}`}>฿/kWh</p>
            </div>
          ))}
        </div>

        {/* Pricing table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 px-4 py-3">
            <div className="col-span-2">เครือข่าย</div>
            <div className="text-center">฿/kWh</div>
            <div className="text-center">ค่าชาร์จ {EXAMPLE_KWH} kWh</div>
            <div className="text-center">DC สูงสุด</div>
            <div className="text-center">หัวชาร์จ</div>
          </div>

          {sorted.map((n, i) => (
            <Link key={n.id} href={`/chargers/${n.id}`}
              className="grid grid-cols-6 px-4 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ backgroundColor: n.color }}>{n.shortName}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{n.name}</p>
                  <p className="text-xs text-gray-400">{n.stations} สถานี</p>
                </div>
              </div>
              <div className="text-center">
                <span className={`text-sm font-black ${i === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {n.pricePerKwh ?? `${n.pricePerMin} ฿/นาที`}
                </span>
              </div>
              <div className="text-center">
                {n.pricePerKwh ? (
                  <span className={`text-sm font-bold ${i === 0 ? "text-green-600" : "text-gray-700"}`}>
                    {(n.pricePerKwh * EXAMPLE_KWH).toFixed(0)} ฿
                  </span>
                ) : <span className="text-sm text-gray-400">แล้วแต่เวลา</span>}
              </div>
              <div className="text-center text-sm text-gray-700 font-medium">{Math.max(...n.dcKw)} kW</div>
              <div className="flex gap-1 justify-center flex-wrap">
                {n.connectors.map(c => (
                  <span key={c} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-medium">{c}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <p className="text-sm text-amber-800">
            <strong>หมายเหตุ:</strong> ราคาอาจเปลี่ยนแปลงได้ตามนโยบายของแต่ละเครือข่าย ราคา DC Fast Charge อาจแตกต่างจาก AC Slow Charge
            แนะนำตรวจสอบในแอปก่อนชาร์จทุกครั้ง
          </p>
        </div>

        <div className="text-center">
          <Link href="/calculator/charging-cost"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-colors">
            <Zap size={16} />คำนวณค่าชาร์จของรถคุณ <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
