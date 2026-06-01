// แพร วริศรา — EV Content Writer
// วันที่ 1: บทความเส้นทาง เชียงใหม่-กรุงเทพด้วยรถ EV

import { Metadata } from "next";
import Link from "next/link";
import { Zap, MapPin, Clock, Battery, Navigation, CheckCircle, Lightbulb, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "เชียงใหม่–กรุงเทพด้วย EV – จุดชาร์จ 696 กม.",
  description:
    "คู่มือขับรถ EV จากเชียงใหม่ถึงกรุงเทพ 696 กม. บอกจุดชาร์จทุกจุด EA Anywhere, PTT EV ใช้เวลาเพิ่มจากรถน้ำมันแค่ 40 นาที",
  keywords: ["เชียงใหม่กรุงเทพ EV", "ขับ EV ทางไกล", "จุดชาร์จทางหลวง", "เส้นทาง EV ไทย"],
};

const STOPS = [
  {
    name: "EA Anywhere ลำพูน",
    km: 26, fromPrev: 26,
    charger: "DC 120kW",
    time: "20 นาที (10→80%)",
    tip: "ปั๊มน้ำมัน PTT ข้างๆ มีห้องน้ำ ร้านอาหาร สะดวกมาก",
    optional: true,
  },
  {
    name: "EA Anywhere ลำปาง",
    km: 100, fromPrev: 74,
    charger: "DC 120kW",
    time: "25 นาที",
    tip: "จุดพักยอดนิยม มีกาแฟ Cafe Amazon อยู่ในปั๊ม",
    optional: false,
  },
  {
    name: "EA Anywhere ตาก",
    km: 250, fromPrev: 150,
    charger: "DC 120kW",
    time: "30 นาที",
    tip: "ถ้าออกจากเชียงใหม่แบตเต็ม อาจข้ามจุดนี้ไปได้ถ้าแบต > 60%",
    optional: true,
  },
  {
    name: "PTT EV Station นครสวรรค์",
    km: 400, fromPrev: 150,
    charger: "DC 50kW",
    time: "40 นาที",
    tip: "จุดสำคัญ เป็นกึ่งกลางเส้นทาง แนะนำแวะพักกินข้าวด้วย",
    optional: false,
  },
  {
    name: "Sharge พระนครศรีอยุธยา",
    km: 580, fromPrev: 180,
    charger: "DC 120kW",
    time: "15 นาที (เติมพอถึง BKK)",
    tip: "ถ้าแบตเหลือ > 30% อาจไม่จำเป็นต้องแวะ ขึ้นอยู่กับรุ่นรถ",
    optional: true,
  },
];

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-5 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">EV Charge Map</span>
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-500">บทความ</span>
      </nav>

      <article className="max-w-3xl mx-auto px-5 py-12">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">เส้นทาง EV</span>
          <span className="text-xs text-gray-400">โดย แพร วริศรา · อัปเดต มิ.ย. 2026</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
          เชียงใหม่ → กรุงเทพด้วยรถ EV<br />
          <span className="text-green-600">ต้องแวะชาร์จที่ไหนบ้าง?</span>
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          ระยะทาง 696 กม. ถือเป็น "บททดสอบ" ของชาว EV ไทยทุกคน ผมขับเส้นนี้มาแล้ว 4 รอบด้วย BYD Seal และ Tesla Model Y จะมาบอกทุกจุดชาร์จที่ต้องรู้ครับ
        </p>

        {/* Summary Card */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-10">
          <p className="text-sm text-gray-400 mb-4 font-medium">สรุปเส้นทาง เชียงใหม่ → กรุงเทพ</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-black text-green-400">696</p>
              <p className="text-xs text-gray-400">กิโลเมตร</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-400">2</p>
              <p className="text-xs text-gray-400">จุดชาร์จบังคับ (แบต 400 กม.)</p>
            </div>
            <div>
              <p className="text-2xl font-black text-orange-400">~40</p>
              <p className="text-xs text-gray-400">นาทีที่เพิ่มจากรถน้ำมัน</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">8-9</p>
              <p className="text-xs text-gray-400">ชั่วโมงรวมพักกินข้าว</p>
            </div>
          </div>
        </div>

        {/* Route visual */}
        <h2 className="text-xl font-black text-gray-900 mb-6">จุดชาร์จตลอดเส้นทาง</h2>

        <div className="relative mb-10">
          {/* Origin */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900">ต้นทาง: เชียงใหม่</p>
              <p className="text-sm text-gray-500">ออกเดินทางพร้อมแบต 100% — ชาร์จที่บ้านหรือโรงแรมค้างคืน</p>
            </div>
          </div>

          <div className="ml-5 border-l-2 border-dashed border-gray-200 pl-9 space-y-0">
            {STOPS.map((stop, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] top-4">
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow ${stop.optional ? "bg-gray-300" : "bg-blue-500"}`} />
                </div>
                <div className={`my-4 rounded-2xl border p-4 ${stop.optional ? "border-gray-100 bg-gray-50" : "border-blue-100 bg-blue-50"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className={stop.optional ? "text-gray-400" : "text-blue-600"} />
                        <p className="font-bold text-gray-900 text-sm">{stop.name}</p>
                        {!stop.optional && (
                          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">แวะที่นี่</span>
                        )}
                        {stop.optional && (
                          <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">ไม่บังคับ</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Lightbulb size={11} /> {stop.tip}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Battery size={11} />{stop.charger}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{stop.time}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-gray-900">{stop.km}</p>
                      <p className="text-[10px] text-gray-400">กม.จากต้นทาง</p>
                      <p className="text-[10px] text-green-600 font-medium">+{stop.fromPrev} กม.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Destination */}
          <div className="flex items-center gap-4 mt-2">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900">ปลายทาง: กรุงเทพมหานคร</p>
              <p className="text-sm text-gray-500">696 กม. — ถึงแล้ว!</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            เคล็ดลับจากประสบการณ์จริง
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-2"><Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />ออกเดินทางตีห้าครึ่งหรือหกโมงเช้า หลีกเลี่ยงรถติดขาออก</li>
            <li className="flex gap-2"><Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />ชาร์จที่ลำปางควบคู่กับกินข้าวเช้า ไม่เสียเวลาเพิ่ม</li>
            <li className="flex gap-2"><Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />ใช้ AC เบาๆ ช่วงดอยขุนตาลช่วยประหยัดแบตได้ ~8%</li>
            <li className="flex gap-2"><Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />ดาวน์โหลด app EA Anywhere และ PTT EV ก่อนออกเดินทาง</li>
            <li className="flex gap-2"><Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />ถ้าแบตรถ &gt; 450 กม. อาจแวะแค่จุดเดียวที่นครสวรรค์ก็ถึงได้</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="border border-gray-100 rounded-2xl p-6 text-center">
          <p className="font-bold text-gray-900 mb-2">วางแผนเส้นทางนี้ได้เลย</p>
          <p className="text-sm text-gray-500 mb-4">ใส่ระยะแบตรถของคุณ ระบบจะคำนวณจุดชาร์จที่เหมาะสมให้อัตโนมัติ</p>
          <Link href="/map"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Navigation size={16} />วางแผนเส้นทางบนแผนที่
          </Link>
        </div>
      </article>
    </div>
  );
}
