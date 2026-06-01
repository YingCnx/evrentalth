import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Zap, ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";
import { CHARGER_NETWORKS } from "../../lib/chargers";
import PageLayout from "../../components/PageLayout";

export async function generateStaticParams() {
  return CHARGER_NETWORKS.map(n => ({ network: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ network: string }> }): Promise<Metadata> {
  const { network } = await params;
  const n = CHARGER_NETWORKS.find(n => n.id === network);
  if (!n) return {};
  return {
    title: `${n.name} – สถานีชาร์จ ${n.stations} แห่ง ${n.provinces} จังหวัด`,
    description: `${n.name} เครือข่ายชาร์จ EV ค่าบริการ ${n.priceNote} หัวชาร์จ ${n.connectors.join(", ")} ครอบคลุม ${n.provinces} จังหวัดทั่วไทย`,
  };
}

export default async function NetworkPage({ params }: { params: Promise<{ network: string }> }) {
  const { network } = await params;
  const n = CHARGER_NETWORKS.find(n => n.id === network);
  if (!n) notFound();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <Link href="/chargers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft size={15} />กลับรายชื่อเครือข่าย
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
            style={{ backgroundColor: n.color }}>
            {n.shortName}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{n.name}</h1>
            <p className="text-gray-500">{n.stations} สถานี · {n.provinces} จังหวัด</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-gray-900">{n.stations}</p>
            <p className="text-sm text-gray-500">สถานีชาร์จ</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-gray-900">{n.provinces}</p>
            <p className="text-sm text-gray-500">จังหวัดที่ครอบคลุม</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-gray-900">{Math.max(...n.dcKw)}</p>
            <p className="text-sm text-gray-500">kW สูงสุด (DC)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-100 rounded-2xl p-5">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2"><Zap size={16} className="text-green-500" />ข้อมูลการชาร์จ</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">ค่าบริการ</span><span className="font-bold text-gray-900">{n.priceNote}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">DC Charge</span><span className="font-bold">{n.dcKw.join(", ")} kW</span></div>
              <div className="flex justify-between"><span className="text-gray-500">AC Charge</span><span className="font-bold">{n.acKw.join(", ")} kW</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">หัวชาร์จ</span>
                <div className="flex gap-1">{n.connectors.map(c => <span key={c} className="text-xs bg-gray-100 px-2 py-0.5 rounded-lg font-medium">{c}</span>)}</div>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">แอปพลิเคชัน</span><span className="font-bold">{n.app}</span></div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2"><MapPin size={16} className="text-green-500" />จุดเด่น</h2>
            <ul className="space-y-2">
              {n.highlights.map(h => (
                <li key={h} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${n.color}20` }}>
                    <Zap size={10} style={{ color: n.color }} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/map?operator=${n.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors">
            <MapPin size={16} />ดูสถานีบนแผนที่
          </Link>
          <a href={n.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-5 py-3.5 rounded-2xl transition-colors text-sm">
            <ExternalLink size={14} />เว็บไซต์ {n.name}
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">เครือข่ายอื่น</p>
          <div className="flex gap-3 flex-wrap">
            {CHARGER_NETWORKS.filter(x => x.id !== n.id).map(x => (
              <Link key={x.id} href={`/chargers/${x.id}`}
                className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2 hover:border-green-200 transition-colors text-sm">
                <div className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-black" style={{ backgroundColor: x.color }}>{x.shortName[0]}</div>
                {x.name} <ChevronRight size={12} className="text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
