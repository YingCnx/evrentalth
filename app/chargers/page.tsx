import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Zap, ChevronRight } from "lucide-react";
import { CHARGER_NETWORKS } from "../lib/chargers";
import PageLayout from "../components/PageLayout";

export const metadata: Metadata = {
  title: "เครือข่ายชาร์จ EV ทั้งหมดในไทย | EV Charge Map",
  description: "รวมเครือข่ายสถานีชาร์จรถไฟฟ้าทั้งหมดในไทย EA Anywhere, PTT EV, Sharge, Plugify เปรียบเทียบค่าบริการ จำนวนสถานี และความครอบคลุม",
};

export default function ChargersPage() {
  const total = CHARGER_NETWORKS.reduce((s, n) => s + n.stations, 0);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">เครือข่ายสถานีชาร์จ EV ในไทย</h1>
          <p className="text-gray-500">{CHARGER_NETWORKS.length} เครือข่าย · {total.toLocaleString()}+ สถานีทั่วประเทศ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {CHARGER_NETWORKS.map(n => (
            <Link key={n.id} href={`/chargers/${n.id}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: n.color }}>
                  {n.shortName}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="font-black text-gray-900">{n.name}</h2>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={11} />{n.stations} สถานี</span>
                    <span>{n.provinces} จังหวัด</span>
                    <span className="font-semibold text-gray-700">{n.priceNote.split(" ")[0]} ฿/kWh</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {n.connectors.map(c => (
                      <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium">{c}</span>
                    ))}
                    {n.highlights.slice(0, 1).map(h => (
                      <span key={h} className="text-[10px] px-2 py-0.5 rounded-lg font-medium text-green-700" style={{ backgroundColor: `${n.color}18` }}>{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/chargers/pricing"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-2xl transition-colors">
            <Zap size={16} />เปรียบเทียบค่าบริการทุกเครือข่าย
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
