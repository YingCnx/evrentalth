import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Zap, Navigation, ArrowLeft, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { EV_ROUTES, getRoute } from "../../lib/routes";
import PageLayout from "../../components/PageLayout";

export async function generateStaticParams() {
  return EV_ROUTES.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) return {};
  return {
    title: `${r.from}-${r.to} ด้วยรถ EV ${r.distKm} กม. แวะชาร์จที่ไหน? | EV Charge Map`,
    description: r.description,
    keywords: [`${r.from} ${r.to} EV`, `เส้นทาง EV ${r.to}`, `จุดชาร์จ ${r.from} ${r.to}`],
  };
}

export default async function RouteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) notFound();

  const requiredStops = r.stops.filter(s => s.required);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-5 py-8">
        <Link href="/routes" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft size={15} />กลับรายการเส้นทาง
        </Link>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">เส้นทาง EV</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          {r.from} → {r.to} ด้วยรถ EV
        </h1>
        <p className="text-gray-500 mb-8">{r.description}</p>

        {/* Summary */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">สรุปเส้นทาง</p>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><p className="text-2xl font-black text-green-400">{r.distKm}</p><p className="text-xs text-gray-400">กม.</p></div>
            <div><p className="text-2xl font-black text-blue-400">{r.durationHr}</p><p className="text-xs text-gray-400">ชม.</p></div>
            <div><p className="text-2xl font-black text-orange-400">{requiredStops.length}</p><p className="text-xs text-gray-400">จุดชาร์จบังคับ</p></div>
            <div><p className="text-2xl font-black text-white">{requiredStops.reduce((s, x) => s + x.chargeMin, 0)}</p><p className="text-xs text-gray-400">นาทีที่หยุด</p></div>
          </div>
        </div>

        {/* Route */}
        <h2 className="text-xl font-black text-gray-900 mb-5">จุดชาร์จตลอดเส้นทาง</h2>
        <div className="relative mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-100">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900">{r.from}</p>
              <p className="text-sm text-gray-500">ออกเดินทาง — แบตเต็ม 100%</p>
            </div>
          </div>

          {r.stops.length === 0 ? (
            <div className="ml-5 border-l-2 border-dashed border-green-200 pl-9 py-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-800">ไม่ต้องแวะชาร์จเลย!</p>
                  <p className="text-sm text-green-600">ระยะทาง {r.distKm} กม. รถ EV แบตมาตรฐาน 400 กม. ถึงได้สบาย</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="ml-5 border-l-2 border-dashed border-gray-200 pl-9">
              {r.stops.map((stop, i) => (
                <div key={i} className="relative my-4">
                  <div className="absolute -left-[41px] top-4">
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow ${stop.required ? "bg-blue-500" : "bg-gray-300"}`} />
                  </div>
                  <div className={`rounded-2xl border p-4 ${stop.required ? "border-blue-100 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={13} className={stop.required ? "text-blue-600" : "text-gray-400"} />
                          <p className="font-bold text-gray-900 text-sm">{stop.name}</p>
                          {stop.required
                            ? <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">แวะที่นี่</span>
                            : <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">ไม่บังคับ</span>}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Lightbulb size={11} /> {stop.tip}</p>
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span>{stop.network}</span>
                          <span className="flex items-center gap-1"><Zap size={10} />{stop.dcKw} kW</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{stop.chargeMin} นาที</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-black text-gray-900">{stop.km}</p>
                        <p className="text-[10px] text-gray-400">กม.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-100">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900">{r.to}</p>
              <p className="text-sm text-gray-500">{r.distKm} กม. — ถึงแล้ว!</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <p className="font-black text-gray-900 mb-3">จุดเด่นของเส้นทางนี้</p>
          <ul className="space-y-2">
            {r.highlights.map(h => (
              <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />{h}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <AlertCircle size={11} />รถที่เหมาะ: {r.bestCar}
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Link href={`/map?tab=route&from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`} className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors">
            <Navigation size={16} />วางแผนเส้นทางนี้
          </Link>
          <Link href="/cars" className="flex items-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold px-5 py-3.5 rounded-2xl transition-colors text-sm">
            เลือกรถ EV
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
