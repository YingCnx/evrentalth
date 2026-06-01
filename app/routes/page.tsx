import { Metadata } from "next";
import Link from "next/link";
import { Navigation, Zap, ChevronRight, MapPin } from "lucide-react";
import { EV_ROUTES } from "../lib/routes";
import PageLayout from "../components/PageLayout";

export const metadata: Metadata = {
  title: "เส้นทาง EV ยอดนิยม – วางแผนทริปทั่วไทย",
  description: "คู่มือเส้นทางขับรถ EV ทั่วไทย กรุงเทพ-เชียงใหม่ กรุงเทพ-ภูเก็ต กรุงเทพ-หัวหิน พร้อมจุดชาร์จทุกจุด",
};

export default function RoutesPage() {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">เส้นทาง EV ยอดนิยมในไทย</h1>
          <p className="text-gray-500">คู่มือครบจุดชาร์จทุกเส้นทาง คำนวณจากแบต 400 กม.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EV_ROUTES.map(r => (
            <div key={r.slug} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all group flex flex-col">
              {/* Route visual */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="w-0.5 h-8 bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{r.from}</p>
                  <p className="text-xs text-gray-400 my-0.5">↓ {r.distKm} กม.</p>
                  <p className="font-bold text-gray-900 text-sm">{r.to}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-sm font-black text-gray-900">{r.distKm}</p>
                  <p className="text-[10px] text-gray-400">กม.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-sm font-black text-gray-900">{r.durationHr}</p>
                  <p className="text-[10px] text-gray-400">ชม.</p>
                </div>
                <div className={`rounded-xl p-2 text-center ${r.stops.length === 0 ? "bg-green-50" : "bg-blue-50"}`}>
                  <p className={`text-sm font-black ${r.stops.length === 0 ? "text-green-700" : "text-blue-700"}`}>{r.stops.length}</p>
                  <p className={`text-[10px] ${r.stops.length === 0 ? "text-green-500" : "text-blue-400"}`}>จุดชาร์จ</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">{r.description}</p>

              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.stops.length === 0 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  <span className="flex items-center gap-1"><Zap size={11} />{r.stops.length === 0 ? "ไม่ต้องแวะชาร์จ" : `แวะ ${r.stops.filter(s => s.required).length} จุด`}</span>
                </span>
                <Link href={`/routes/${r.slug}`} className="text-xs text-green-600 font-semibold hover:underline flex items-center gap-1">
                  ดูคู่มือ <ChevronRight size={12} />
                </Link>
              </div>
              <Link
                href={`/map?tab=route&from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
                className="flex items-center justify-center gap-1.5 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
              >
                <Navigation size={12} />เปิดแผนที่เส้นทาง
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gray-50 rounded-2xl p-6 text-center">
          <Navigation size={28} className="text-green-500 mx-auto mb-3" />
          <p className="font-black text-gray-900 mb-1">ไม่เจอเส้นทางที่ต้องการ?</p>
          <p className="text-sm text-gray-500 mb-4">ใช้ route planner วางแผนเส้นทางของคุณเองได้เลย</p>
          <Link href="/map" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm">
            <MapPin size={15} />เปิด Route Planner
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
