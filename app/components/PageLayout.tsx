"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, MapPin, Car, Navigation, Calculator, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/map", label: "แผนที่ชาร์จ", icon: MapPin },
  { href: "/cars", label: "เปรียบเทียบรถ", icon: Car },
  { href: "/routes", label: "เส้นทาง EV", icon: Navigation },
  { href: "/chargers", label: "เครือข่ายชาร์จ", icon: Zap },
  { href: "/calculator", label: "คำนวณคืนทุน", icon: Calculator },
  { href: "/blog", label: "บทความ", icon: BookOpen },
];

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-cyan-400 rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-gray-900" fill="currentColor" />
            </div>
            <div className="leading-none hidden sm:block">
              <p className="font-bold text-sm text-gray-900">EV Charge Map</p>
              <p className="text-[10px] text-gray-400">Thailand</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  pathname.startsWith(n.href)
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}>
                <n.icon size={12} />{n.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/map"
              className="hidden sm:flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-gray-900 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              <MapPin size={13} />เปิดแผนที่
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-5 py-3 grid grid-cols-2 gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname.startsWith(n.href) ? "bg-cyan-50 text-cyan-700" : "text-gray-600 hover:bg-gray-50"
                }`}>
                <n.icon size={14} />{n.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="text-gray-400 py-10 mt-auto" style={{ background: "#0A0F1A" }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-cyan-400 rounded-lg flex items-center justify-center">
                  <Zap size={14} className="text-gray-900" fill="currentColor" />
                </div>
                <span className="font-bold text-white text-sm">EV Charge Map Thailand</span>
              </div>
              <p className="text-xs text-gray-500 max-w-xs">แพลตฟอร์ม EV ครบวงจร ข้อมูลจาก OpenStreetMap</p>
            </div>
            <div className="grid grid-cols-3 gap-x-12 gap-y-2 text-xs">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} className="hover:text-white transition-colors">{n.label}</Link>
              ))}
              <Link href="/about" className="hover:text-white transition-colors">เกี่ยวกับเรา</Link>
              <Link href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">นโยบายส่วนตัว</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>© 2026 EV Charge Map Thailand · ข้อมูลจาก <a href="https://www.openstreetmap.org" className="hover:text-gray-400 underline" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></p>
            <p className="flex items-center gap-1">Made with <Zap size={11} className="text-cyan-400" /> in Thailand</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
