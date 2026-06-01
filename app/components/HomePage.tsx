"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap, MapPin, Navigation, Calculator, Car, ChevronRight,
  Search, Star, ArrowRight, ChevronDown, CheckCircle,
  Users, BarChart2, Menu,
} from "lucide-react";
import { EV_CARS } from "../lib/cars";

gsap.registerPlugin(ScrollTrigger);

const HeroMap = dynamic(() => import("./HeroMap"), { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> });

const STATS_BAR = [
  { icon: Zap, value: "3,200+", label: "จุดชาร์จทั่วไทย" },
  { icon: BarChart2, value: "15+", label: "เครือข่ายผู้ให้บริการ" },
  { icon: MapPin, value: "77", label: "จังหวัดครอบคลุม" },
  { icon: Navigation, value: "Real-time", label: "อัปเดตข้อมูลตลอดเวลา" },
  { icon: CheckCircle, value: "FREE", label: "ไม่มีค่าใช้จ่าย" },
  { icon: Users, value: "25,000+", label: "ผู้ใช้งานแล้ว" },
];

const FILTER_CHIPS = [
  { label: "ใกล้ฉัน", href: "/map" },
  { label: "ปั๊มน้ำมัน", href: "/map?q=ปั๊มน้ำมัน" },
  { label: "ห้างสรรพค้า", href: "/map?q=ห้าง" },
  { label: "ร้านกาแฟ", href: "/map?q=กาแฟ" },
  { label: "เพิ่มเติม", href: "/map" },
];

const FEATURES = [
  {
    icon: MapPin,
    bg: "from-cyan-500 to-blue-600",
    title: "แผนที่จุดชาร์จ",
    desc: "ค้นหาจุดชาร์จใกล้คุณแบบ real-time กรองตามประเภทหัวชาร์จ และความเร็วในการชาร์จ",
    cta: "เปิดแผนที่",
    href: "/map",
  },
  {
    icon: Navigation,
    bg: "from-violet-500 to-purple-600",
    title: "วางแผนเส้นทาง",
    desc: "ใส่แผนการเดินทางได้ง่าย พร้อมแนะนำจุดแวะชาร์จตลอดเส้นทาง",
    cta: "วางแผนเส้นทาง",
    href: "/map",
  },
  {
    icon: Car,
    bg: "from-emerald-500 to-teal-600",
    title: "เปรียบเทียบรถ EV",
    desc: "เปรียบเทียบสเปค ระยะทาง ความเร็วชาร์จ และราคา ของรถ EV รุ่นต่างๆ",
    cta: "ดูรุ่นทั้งหมด",
    href: "/cars",
  },
  {
    icon: Calculator,
    bg: "from-orange-500 to-rose-500",
    title: "คำนวณคืนทุน",
    desc: "คำนวณค่าใช้จ่ายต่างๆ เปรียบเทียบกับรถน้ำมัน และวางแผนค่าใช้จ่าย",
    cta: "คำนวณเลย",
    href: "/calculator",
  },
];

const POPULAR_ROUTES = [
  { from: "กรุงเทพฯ", to: "เชียงใหม่", dist: 696, stops: 2, timeHr: 9, costBaht: 350, fromSlug: "bangkok", toSlug: "chiang-mai" },
  { from: "กรุงเทพฯ", to: "ภูเก็ต", dist: 862, stops: 3, timeHr: 12, costBaht: 430, fromSlug: "bangkok", toSlug: "phuket" },
  { from: "กรุงเทพฯ", to: "ขอนแก่น", dist: 449, stops: 1, timeHr: 6, costBaht: 220, fromSlug: "bangkok", toSlug: "khon-kaen" },
  { from: "เชียงใหม่", to: "เชียงราย", dist: 198, stops: 0, timeHr: 3, costBaht: 100, fromSlug: "chiang-mai", toSlug: "chiang-rai" },
  { from: "กรุงเทพฯ", to: "หัวหิน", dist: 245, stops: 0, timeHr: 3, costBaht: 120, fromSlug: "bangkok", toSlug: "hua-hin" },
];

const TOP_CARS = EV_CARS.filter((c) => ["byd-seal", "byd-dolphin", "mg4-electric"].includes(c.id));

const FAQS = [
  {
    q: "รถ EV ชาร์จเดินที่ไหนมาก?",
    a: "สามารถชาร์จได้ที่บ้าน ห้างสรรพสินค้า ปั๊มน้ำมัน และสถานีชาร์จเฉพาะ EV ทั่วประเทศ ปัจจุบันมีมากกว่า 3,200 จุดทั่วไทย",
  },
  {
    q: "เดินทางไกล กรุงเทพ-เชียงใหม่ ต้องแวะชาร์จกี่ครั้ง?",
    a: "สำหรับรถ EV ระยะทาง 400+ กม. อย่าง BYD Seal หรือ Tesla Model 3 ต้องแวะชาร์จประมาณ 1-2 ครั้ง แวะละ 20-30 นาที รวมเวลาเพิ่มขึ้นประมาณ 40-60 นาที",
  },
  {
    q: "แบตเตอรีเสื่อมเร็วจริงไหม?",
    a: "แบตเตอรี EV รุ่นใหม่เสื่อมประมาณ 2-3% ต่อปี และมีการรับประกันแบตเตอรีโดยทั่วไป 8 ปี หรือ 160,000 กม. ถือว่าเสื่อมช้ามากเมื่อเทียบกับความกังวลของผู้บริโภค",
  },
  {
    q: "รถ EV คุ้มกว่ารถน้ำมันจริงหรือไม่?",
    a: "สำหรับผู้ขับเฉลี่ย 60+ กม./วัน ประหยัดค่าเชื้อเพลิง 60-70% ต่อเดือน คืนทุนภายใน 5-7 ปี ขึ้นกับรุ่นรถและพฤติกรรมการขับ",
  },
];

const PARTNERS = ["PTT EV Station", "EA ANYWHERE", "EV STATION PLUZ", "PEA VOLTA", "EleXA", "SHARGE", "GWM", "BYD"];

function formatPrice(n: number) {
  return n.toLocaleString("th-TH");
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState("");

  useGSAP(() => {
    gsap.from(".hero-anim", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });
    gsap.from(".stat-anim", {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power2.out",
      scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
    });
    gsap.fromTo(".feature-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: featuresRef.current, start: "top 85%", once: true },
      }
    );
  }, { scope: heroRef });

  return (
    <div className="min-h-screen bg-white" ref={heroRef}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-cyan-400 rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-gray-900" fill="currentColor" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-sm text-gray-900">EV Charge Map</p>
              <p className="text-[10px] text-gray-400">Thailand</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <Link href="/map" className="hover:text-gray-900 transition-colors">แผนที่จุดชาร์จ</Link>
            <Link href="/map" className="hover:text-gray-900 transition-colors">วางแผนเส้นทาง</Link>
            <Link href="/cars" className="hover:text-gray-900 transition-colors">เปรียบเทียบรถ EV</Link>
            <Link href="/calculator" className="hover:text-gray-900 transition-colors">คำนวณคืนทุน</Link>
            <Link href="/blog" className="hover:text-gray-900 transition-colors">บทความ EV</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/map"
              className="hidden sm:flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-gray-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              <MapPin size={14} />เปิดแผนที่
            </Link>
            <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Menu size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white" style={{ minHeight: 520 }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

          {/* Left — content */}
          <div className="flex flex-col justify-center px-5 lg:px-10 py-14 lg:py-20 relative z-10">
            <div className="hero-anim inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1 text-xs font-semibold text-cyan-700 mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              อัปเดตข้อมูลแบบ Real-time
            </div>

            <h1 className="hero-anim text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              ค้นหาสถานีชาร์จ EV<br />
              <span className="text-cyan-500">ทั่วประเทศไทย</span>
            </h1>
            <p className="hero-anim text-base text-gray-500 leading-relaxed mb-6 max-w-md">
              วางแผนเส้นทางได้ง่าย ค้นหาจุดชาร์จแบบ real-time<br className="hidden md:block" />
              เปรียบเทียบรถ EV และคำนวณค่าใช้จ่ายก่อนเดินทาง
            </p>

            {/* Search bar */}
            <div className="hero-anim flex gap-2 mb-4 max-w-md">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white shadow-sm focus-within:border-cyan-400 transition-colors">
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="ค้นหาสถานีชาร์จ ใกล้ฉัน หรือ พิมพ์ชื่อสถานที่"
                  className="text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none w-full"
                />
              </div>
              <Link
                href={`/map${searchVal ? `?q=${encodeURIComponent(searchVal)}` : ""}`}
                className="bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors flex-shrink-0"
              >
                ค้นหา
              </Link>
            </div>

            {/* Filter chips */}
            <div className="hero-anim flex flex-wrap gap-2 mb-8">
              {FILTER_CHIPS.map((c) => (
                <Link key={c.label} href={c.href}
                  className="text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:border-cyan-300 hover:text-cyan-700 px-3 py-1.5 rounded-full transition-colors">
                  {c.label}
                </Link>
              ))}
            </div>

            {/* Inline stats */}
            <div className="hero-anim flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-1.5 text-gray-700">
                <Zap size={14} className="text-cyan-500" />
                <span className="font-bold">3,200+</span> <span className="text-gray-400">จุดชาร์จ</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <BarChart2 size={14} className="text-cyan-500" />
                <span className="font-bold">15+</span> <span className="text-gray-400">เครือข่าย</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <MapPin size={14} className="text-cyan-500" />
                <span className="font-bold">77</span> <span className="text-gray-400">จังหวัด</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <CheckCircle size={14} className="text-cyan-500" />
                <span className="font-bold text-cyan-600">ข้อมูล Real-time</span>
              </div>
            </div>
          </div>

          {/* Right — live map */}
          <div className="hidden lg:block relative bg-gray-100">
            <HeroMap />
            {/* Left fade overlay */}
            <div className="absolute inset-y-0 left-0 w-16 pointer-events-none z-[300]"
              style={{ background: "linear-gradient(90deg, white, transparent)" }} />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-white" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS_BAR.map((s) => (
              <div key={s.label} className="stat-anim flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                  <s.icon size={16} className="text-cyan-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-none">{s.value}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-5 py-16" ref={featuresRef}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">เครื่องมือสำหรับชาว EV</h2>
            <p className="text-gray-400 text-sm mt-1">ครบทุกอย่างที่ต้องการในที่เดียว</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href}
              className="feature-card group rounded-2xl overflow-hidden border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-all duration-200">
              {/* Card image — hero.jpg + tinted overlay */}
              <div className="relative h-36 overflow-hidden">
                <NextImage src="/hero.jpg" alt={f.title} fill className="object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-500" sizes="400px" />
                <div className={`absolute inset-0 bg-gradient-to-br ${f.bg} opacity-75`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <f.icon size={44} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{f.desc}</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-cyan-600 group-hover:gap-2 transition-all">
                  {f.cta} <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">เส้นทางยอดนิยม</h2>
              <p className="text-gray-400 text-sm mt-1">วางแผนเดินทางด้วย EV ได้เลยในคลิกเดียว</p>
            </div>
            <Link href="/routes" className="hidden md:flex items-center gap-1 text-sm text-cyan-600 font-semibold hover:underline">
              ดูทั้งหมด <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {POPULAR_ROUTES.map((r) => (
              <Link key={`${r.from}-${r.to}`}
                href={`/map?tab=route&from=${r.fromSlug}&to=${r.toSlug}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-cyan-200 hover:shadow-md transition-all group">
                {/* Route visual */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{r.from}</p>
                    <p className="text-[10px] text-gray-400">↓</p>
                    <p className="text-xs font-semibold text-gray-800">{r.to}</p>
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-2.5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">ระยะทาง</span>
                    <span className="font-semibold text-gray-700">{r.dist} กม.</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">จุดชาร์จ</span>
                    <span className={`font-semibold ${r.stops === 0 ? "text-cyan-600" : "text-blue-600"}`}>
                      {r.stops === 0 ? "ไม่ต้องแวะ" : `${r.stops} จุด`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">เวลาเพิ่ม</span>
                    <span className="font-semibold text-gray-700">≈ {r.timeHr} ชม.</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">ค่าชาร์จ</span>
                    <span className="font-semibold text-gray-700">≈ {r.costBaht} บาท</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Car comparison table */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">เปรียบเทียบรถ EV ยอดนิยม</h2>
            <p className="text-gray-400 text-sm mt-1">รุ่นขายดีในไทย เทียบสเปคสำคัญก่อนตัดสินใจ</p>
          </div>
          <Link href="/cars" className="hidden md:flex items-center gap-1 text-sm text-cyan-600 font-semibold hover:underline">
            ดูทั้งหมด <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs">รุ่นรถ</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs">ระยะทาง (WLTP)</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs">ความเร็วชาร์จ DC</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs">แบตเตอรี</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs">ราคาเริ่มต้น</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_CARS.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <NextImage src="/hero.jpg" alt={`${c.brand} ${c.model}`} fill className="object-cover object-right" sizes="64px" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/30" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{c.brand} {c.model}</p>
                        <p className="text-[11px] text-gray-400">{c.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{c.rangeKm} km</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 font-semibold text-gray-800">
                      <Zap size={13} className="text-cyan-500" fill="currentColor" />
                      {c.chargeDcKw} kW
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.batteryKwh} kWh</td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{formatPrice(c.priceMin)} บาท</td>
                  <td className="px-5 py-4">
                    <Link href={`/cars/${c.id}`}
                      className="text-xs font-bold text-white bg-cyan-400 hover:bg-cyan-300 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ + Trust */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* FAQ accordion */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">คำถามที่พบบ่อย</h2>
                <Link href="/blog" className="text-sm text-cyan-600 font-semibold hover:underline flex items-center gap-1">
                  ดูทั้งหมด <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
                          <Zap size={11} className="text-cyan-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{faq.q}</span>
                      </div>
                      <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust + CTA */}
            <div className="space-y-4">
              {/* Still have questions? */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">ยังมีคำถามอยู่?</h3>
                <p className="text-sm text-white/80 mb-4">อ่านบทความและคู่มือการใช้งาน เกี่ยวกับรถ EV เพิ่มเติม</p>
                <Link href="/blog" className="inline-flex items-center gap-1.5 bg-white text-cyan-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-cyan-50 transition-colors">
                  ไปที่คลัง → <ArrowRight size={14} />
                </Link>
              </div>

              {/* Social proof */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">ความเชื่อมั่นจากผู้ใช้งาน</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <Users size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">ผู้ใช้งานกว่า 25,000 คน</p>
                      <p className="text-[11px] text-gray-400">ทั่วประเทศไทย</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <Search size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">ค้นหาจุดชาร์จแล้วกว่า 1.2 ล้านครั้ง</p>
                      <p className="text-[11px] text-gray-400">ข้อมูลอัปเดต real-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                          {["A","B","C","D","E"][i]}
                        </div>
                      ))}
                      <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[9px] text-gray-500 font-bold">+25K</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400" fill="currentColor" />
                    ))}
                    <span className="text-[11px] text-gray-500 ml-1">4.9 / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-center text-xs text-gray-400 font-medium mb-6">ข้อมูลจากเครือข่ายชั้นนำ</p>
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
            {PARTNERS.map((p) => (
              <div key={p} className="bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:border-cyan-300 hover:text-cyan-700 transition-colors cursor-default">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "#0A0F1A" }}>
        <div className="max-w-7xl mx-auto px-5 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(0,200,255,0.15)" }}>
            <Zap size={28} style={{ color: "#00C8FF" }} fill="currentColor" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">พร้อมเดินทางด้วย EV แล้วหรือยัง?</h2>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            เปิดแผนที่ฟรี ไม่ต้องสมัครสมาชิก ค้นหาจุดชาร์จได้ทันที
          </p>
          <Link href="/map"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-colors text-base shadow-xl"
            style={{ background: "#00C8FF", color: "#0A0F1A" }}>
            <MapPin size={18} />เปิดแผนที่จุดชาร์จ
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-gray-400 py-12" style={{ background: "#080C14" }}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-cyan-400 rounded-xl flex items-center justify-center">
                  <Zap size={16} className="text-gray-900" fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">EV Charge Map</p>
                  <p className="text-[10px] text-gray-500">Thailand</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                แพลตฟอร์ม EV ครบวงจรสำหรับคนไทย ข้อมูลจาก OpenStreetMap อัปเดต real-time
              </p>
              <div className="flex gap-2">
                {["f", "▶", "X"].map((icon) => (
                  <div key={icon} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-xs text-gray-400">{icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* เครือข่าย */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">เครือข่าย</p>
              <div className="space-y-2 text-xs">
                <Link href="/map" className="block hover:text-white transition-colors">แผนที่จุดชาร์จ</Link>
                <Link href="/map" className="block hover:text-white transition-colors">วางแผนเส้นทาง</Link>
                <Link href="/chargers" className="block hover:text-white transition-colors">เครือข่ายชาร์จ EV</Link>
                <Link href="/calculator" className="block hover:text-white transition-colors">คำนวณคืนทุน</Link>
              </div>
            </div>

            {/* ข้อมูล */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">ข้อมูล</p>
              <div className="space-y-2 text-xs">
                <Link href="/blog" className="block hover:text-white transition-colors">บทความ EV</Link>
                <Link href="/blog" className="block hover:text-white transition-colors">ข่าวสารและกิจกรรม</Link>
                <Link href="/cars" className="block hover:text-white transition-colors">คู่มือการใช้งาน</Link>
                <Link href="/blog" className="block hover:text-white transition-colors">คำถามที่พบบ่อย</Link>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">ติดตามข่าวสารและอัปเดต</p>
              <p className="text-xs text-gray-500 mb-3">รับข่าวสารและอัปเดตจุดชาร์จ EV ก่อนใคร</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition-colors"
                />
                <button className="bg-cyan-400 hover:bg-cyan-300 text-gray-900 text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                  ติดตาม
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2024 EV Charge Map Thailand. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">นโยบายความเป็นส่วนตัว</Link>
              <Link href="/contact" className="hover:text-gray-400 transition-colors">ติดต่อเราเป็นส่วนตัว</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
