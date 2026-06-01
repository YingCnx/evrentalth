"use client";

import Link from "next/link";
import {
  Zap, MapPin, Navigation, Calculator, Car, ChevronRight,
  Battery, Clock, Shield, TrendingUp, Star, ArrowRight,
} from "lucide-react";

const STATS = [
  { value: "3,200+", label: "จุดชาร์จทั่วไทย" },
  { value: "77", label: "จังหวัดครอบคลุม" },
  { value: "15+", label: "เครือข่ายชาร์จ" },
  { value: "ฟรี", label: "ไม่ต้องสมัครสมาชิก" },
];

const FEATURES = [
  {
    icon: MapPin,
    color: "bg-cyan-50 text-cyan-600",
    title: "แผนที่จุดชาร์จ",
    desc: "ค้นหาสถานีชาร์จใกล้คุณแบบ real-time กรองตามประเภทหัวชาร์จ Type 2, CCS, CHAdeMO, DC Fast Charge",
    cta: "เปิดแผนที่",
    href: "/map",
    badge: "พร้อมใช้",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
  {
    icon: Navigation,
    color: "bg-blue-50 text-blue-600",
    title: "วางแผนเส้นทาง EV",
    desc: "ใส่ต้นทาง-ปลายทาง แล้วดูว่าต้องแวะชาร์จกี่จุด ที่ไหน คำนวณตามระยะแบตรถของคุณ",
    cta: "วางแผนเส้นทาง",
    href: "/map",
    badge: "พร้อมใช้",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
  {
    icon: Car,
    color: "bg-purple-50 text-purple-600",
    title: "เปรียบเทียบรถ EV",
    desc: "สเปค ระยะทาง เวลาชาร์จ ราคา ทุกรุ่นที่ขายในไทย เปรียบเทียบเคียงข้างกันได้เลย",
    cta: "ดูรุ่นทั้งหมด",
    href: "/cars",
    badge: "พร้อมใช้",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
  {
    icon: Calculator,
    color: "bg-orange-50 text-orange-600",
    title: "คำนวณคืนทุน",
    desc: "ขับ Grab / ใช้งานทั่วไป ใส่จำนวน กม./วัน แล้วดูว่าซื้อ EV คืนทุนกี่ปี ประหยัดกว่ารถน้ำมันเท่าไร",
    cta: "คำนวณเลย",
    href: "/calculator",
    badge: "พร้อมใช้",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
];

const POPULAR_ROUTES = [
  { from: "กรุงเทพฯ", to: "เชียงใหม่", dist: 696, stops: 2 },
  { from: "กรุงเทพฯ", to: "ภูเก็ต", dist: 862, stops: 3 },
  { from: "กรุงเทพฯ", to: "ขอนแก่น", dist: 449, stops: 1 },
  { from: "กรุงเทพฯ", to: "พัทยา", dist: 147, stops: 0 },
  { from: "เชียงใหม่", to: "เชียงราย", dist: 198, stops: 0 },
  { from: "กรุงเทพฯ", to: "หัวหิน", dist: 245, stops: 0 },
];

const WHY_EV = [
  { icon: Battery, title: "ประหยัดค่าเชื้อเพลิง", desc: "ค่าชาร์จ 1-2 บาท/กม. เทียบกับน้ำมัน 3-4 บาท/กม." },
  { icon: Clock, title: "ชาร์จเร็วแค่ 20-30 นาที", desc: "DC Fast Charge 80% ในครึ่งชั่วโมง ระหว่างพักกินข้าว" },
  { icon: Shield, title: "บำรุงรักษาน้อย", desc: "ไม่มีน้ำมันเครื่อง ไม่มีคาร์บูเรเตอร์ ค่าซ่อมถูกกว่า" },
  { icon: TrendingUp, title: "คุ้มถ้าขับเยอะ", desc: "ยิ่งขับมาก ยิ่งคืนทุนเร็ว เหมาะกับ Grab / ใช้ประจำวัน" },
];

const EV_BRANDS = ["BYD", "MG", "Neta", "Tesla", "GWM", "Volvo", "BMW", "Mercedes", "Audi", "Deepal"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-cyan-400 rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={17} className="text-gray-900" fill="currentColor" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-sm text-gray-900">EV Charge Map</p>
              <p className="text-[10px] text-gray-400">Thailand</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <Link href="/map" className="hover:text-gray-900 transition-colors">แผนที่ชาร์จ</Link>
            <Link href="/cars" className="hover:text-gray-900 transition-colors">เปรียบเทียบรถ</Link>
            <Link href="/calculator" className="hover:text-gray-900 transition-colors">คำนวณคืนทุน</Link>
            <Link href="/blog" className="hover:text-gray-900 transition-colors">บทความ EV</Link>
          </div>
          <Link
            href="/map"
            className="flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <MapPin size={14} />เปิดแผนที่
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #0A0F1A 0%, #0D1830 50%, #091828 100%)" }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(0,200,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,.2) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" style={{ background: "rgba(0,200,255,0.12)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" style={{ background: "rgba(0,150,255,0.08)" }} />

        <div className="relative max-w-6xl mx-auto px-5 py-24 md:py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border"
              style={{ background: "rgba(0,200,255,0.12)", borderColor: "rgba(0,200,255,0.25)", color: "#00C8FF" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00C8FF" }} />
              อัปเดตข้อมูลแบบ real-time
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              วางแผนเดินทาง<br />
              <span style={{ color: "#00C8FF" }}>ด้วยรถ EV</span><br />
              ให้ง่ายขึ้น
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              แผนที่จุดชาร์จ 3,200+ แห่งทั่วไทย วางแผนเส้นทาง รู้ว่าต้องแวะชาร์จกี่จุด เปรียบเทียบรถ และคำนวณความคุ้ม — ทุกอย่างในที่เดียว
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/map"
                className="flex items-center gap-2 font-bold px-6 py-3.5 rounded-2xl transition-colors text-base shadow-lg"
                style={{ background: "#00C8FF", color: "#0A0F1A", boxShadow: "0 8px 32px rgba(0,200,255,0.25)" }}
              >
                <MapPin size={18} />เปิดแผนที่จุดชาร์จ
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/map"
                className="flex items-center gap-2 border text-white font-semibold px-6 py-3.5 rounded-2xl transition-colors text-base hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.15)" }}
              >
                <Navigation size={18} />วางแผนเส้นทาง
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">เครื่องมือสำหรับชาว EV</h2>
          <p className="text-gray-500 max-w-md mx-auto">ครบทุกอย่างที่ต้องการ ตั้งแต่หาจุดชาร์จ ไปจนถึงตัดสินใจซื้อรถ</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-cyan-200 hover:shadow-lg transition-all duration-200"
              style={{ ["--tw-shadow-color" as string]: "rgba(0,200,255,0.08)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.badgeColor}`}>{f.badge}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.desc}</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-cyan-600 group-hover:gap-2 transition-all">
                {f.cta} <ChevronRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">เส้นทางยอดนิยม</h2>
              <p className="text-gray-500">วางแผนเดินทางด้วย EV ได้เลยในคลิกเดียว</p>
            </div>
            <Link href="/map" className="hidden md:flex items-center gap-1 text-sm text-cyan-600 font-semibold hover:underline">
              ดูทั้งหมด <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_ROUTES.map((r) => (
              <Link
                key={`${r.from}-${r.to}`}
                href="/map"
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-cyan-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <div className="w-0.5 h-5 bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.from}</p>
                    <p className="text-xs text-gray-400 my-0.5">↓</p>
                    <p className="text-sm font-semibold text-gray-800">{r.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                  <span className="font-medium">{r.dist} กม.</span>
                  <span className={`flex items-center gap-1 font-semibold ${r.stops === 0 ? "text-cyan-600" : "text-blue-600"}`}>
                    <Zap size={11} />
                    {r.stops === 0 ? "ไม่ต้องแวะชาร์จ" : `แวะชาร์จ ${r.stops} จุด`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why EV */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">ทำไมต้อง EV?</h2>
          <p className="text-gray-500">คำถามที่คนสงสัยก่อนซื้อรถไฟฟ้า</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_EV.map((w) => (
            <div key={w.title} className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <w.icon size={22} className="text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{w.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EV Brands */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-center text-sm text-gray-400 mb-6 font-medium">รองรับข้อมูลรถ EV จากทุกยี่ห้อที่ขายในไทย</p>
          <div className="flex flex-wrap justify-center gap-3">
            {EV_BRANDS.map((b) => (
              <span key={b} className="bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "#0A0F1A" }}>
        <div className="max-w-6xl mx-auto px-5 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(0,200,255,0.15)" }}>
            <Zap size={28} style={{ color: "#00C8FF" }} fill="currentColor" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">พร้อมเดินทางด้วย EV แล้วหรือยัง?</h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>เปิดแผนที่ฟรี ไม่ต้องสมัครสมาชิก ค้นหาจุดชาร์จได้ทันที</p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-colors text-base shadow-xl"
            style={{ background: "#00C8FF", color: "#0A0F1A" }}
          >
            <MapPin size={18} />เปิดแผนที่จุดชาร์จ
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-gray-400 py-12" style={{ background: "#080C14" }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#00C8FF" }}>
                  <Zap size={17} className="text-gray-900" fill="currentColor" />
                </div>
                <span className="font-bold text-white text-sm">EV Charge Map Thailand</span>
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                แพลตฟอร์มข้อมูล EV ครบวงจรสำหรับคนไทย ข้อมูลจาก OpenStreetMap อัปเดต real-time
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
              <Link href="/map" className="hover:text-white transition-colors">แผนที่จุดชาร์จ</Link>
              <Link href="/cars" className="hover:text-white transition-colors">เปรียบเทียบรถ EV</Link>
              <Link href="/routes" className="hover:text-white transition-colors">วางแผนเส้นทาง</Link>
              <Link href="/calculator" className="hover:text-white transition-colors">คำนวณคืนทุน</Link>
              <Link href="/blog" className="hover:text-white transition-colors">บทความ EV</Link>
              <Link href="/chargers" className="hover:text-white transition-colors">เครือข่ายชาร์จ</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2026 EV Charge Map Thailand · ข้อมูลจาก <a href="https://www.openstreetmap.org" className="hover:text-gray-400 underline">OpenStreetMap</a></p>
            <div className="flex items-center gap-1">
              <Star size={11} style={{ color: "#00C8FF" }} fill="currentColor" />
              <span>Made in Thailand</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
