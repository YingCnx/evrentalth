import { Metadata } from "next";
import Link from "next/link";
import {
  Zap, Users, Target, Heart, Code2, Database, Palette, FlaskConical,
  Search, PenLine, Film, Megaphone, Handshake, Briefcase, MapPin,
  BarChart2, CheckCircle, Mail, MessageCircle, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import PageLayout from "../components/PageLayout";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา – EV Charge Map Thailand",
  description: "EV Charge Map Thailand แพลตฟอร์ม EV ครบวงจรสำหรับคนไทย พันธกิจ ทีมงาน สถิติ และวิธีร่วมงานกับเรา",
};

const STATS = [
  { icon: Zap, value: "3,200+", label: "จุดชาร์จในฐานข้อมูล" },
  { icon: Users, value: "25,000+", label: "ผู้ใช้งานต่อเดือน" },
  { icon: MapPin, value: "77", label: "จังหวัดครอบคลุม" },
  { icon: BarChart2, value: "1.2M+", label: "ครั้งค้นหาสะสม" },
];

const MILESTONES = [
  { year: "ก.พ. 2025", title: "เริ่มต้นโปรเจกต์", desc: "ทีมก่อตั้งรวมตัว เริ่มพัฒนา MVP แผนที่จุดชาร์จ" },
  { year: "เม.ย. 2025", title: "เปิด Beta", desc: "เปิดให้ผู้ใช้กลุ่มแรก 500 คนทดสอบระบบ" },
  { year: "มิ.ย. 2025", title: "Launch สาธารณะ", desc: "เปิดใช้งานฟรีทั่วประเทศ ครอบคลุม 77 จังหวัด" },
  { year: "2026", title: "Super App EV", desc: "เพิ่มฟีเจอร์วางแผนเส้นทาง เปรียบเทียบรถ คำนวณคืนทุน" },
];

const TEAM: { name: string; role: string; icon: LucideIcon; color: string; focus: string }[] = [
  { name: "ภูมิ วงศ์เทพ", role: "Full-stack Developer", icon: Code2, color: "bg-blue-100 text-blue-600", focus: "Next.js, API, Map" },
  { name: "นัท สิริมงคล", role: "Data Engineer", icon: Database, color: "bg-indigo-100 text-indigo-600", focus: "OpenStreetMap, ข้อมูลรถ EV" },
  { name: "มิ้นท์ จันทร์เพ็ญ", role: "UX/UI Designer", icon: Palette, color: "bg-pink-100 text-pink-600", focus: "Design System, Mobile UX" },
  { name: "เบส ธีรพงศ์", role: "QA Tester", icon: FlaskConical, color: "bg-amber-100 text-amber-600", focus: "Mobile Testing, Accessibility" },
  { name: "ก้อง ธนพล", role: "SEO Specialist", icon: Search, color: "bg-green-100 text-green-600", focus: "SEO, Province Pages" },
  { name: "แพร วริศรา", role: "EV Content Writer", icon: PenLine, color: "bg-teal-100 text-teal-600", focus: "บทความ คู่มือ EV" },
  { name: "เจมส์ ปณิธาน", role: "Video Creator", icon: Film, color: "bg-red-100 text-red-600", focus: "YouTube, Tutorial" },
  { name: "ฝน ชลธิชา", role: "Digital Marketing", icon: Megaphone, color: "bg-orange-100 text-orange-600", focus: "Facebook, LINE OA" },
  { name: "บอส ศุภวิชญ์", role: "Community Manager", icon: Users, color: "bg-cyan-100 text-cyan-600", focus: "LINE OA, Community" },
  { name: "อาย ปริยากร", role: "Partnership Manager", icon: Handshake, color: "bg-violet-100 text-violet-600", focus: "Brand, Partner Relations" },
  { name: "ต้น วีรภัทร", role: "Business Development", icon: Briefcase, color: "bg-gray-100 text-gray-600", focus: "Strategy, Growth" },
];

const VALUES = [
  { icon: Target, title: "พันธกิจ", desc: "ทำให้การเดินทางด้วยรถ EV ในไทยง่ายขึ้น ด้วยข้อมูลที่ถูกต้อง ครบถ้วน และ real-time" },
  { icon: Heart, title: "วิสัยทัศน์", desc: "เป็น Super App สำหรับชาว EV ไทย ตั้งแต่หาจุดชาร์จ ไปจนถึงตัดสินใจซื้อรถ" },
  { icon: CheckCircle, title: "หลักการ", desc: "ข้อมูลโปร่งใส ฟรีตลอด ไม่เก็บข้อมูลส่วนตัวโดยไม่จำเป็น และให้ชุมชน EV เติบโตด้วยกัน" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ background: "#00C8FF" }}>
            <Zap size={30} className="text-gray-900" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">EV Charge Map Thailand</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            แพลตฟอร์ม EV ครบวงจรสำหรับคนไทย ข้อมูล real-time จาก OpenStreetMap
            ครอบคลุมทั้ง 77 จังหวัด ฟรี ไม่ต้องสมัครสมาชิก
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link href="/map"
              className="flex items-center gap-2 font-bold px-6 py-3 rounded-2xl text-sm transition-colors"
              style={{ background: "#00C8FF", color: "#08101e" }}>
              <MapPin size={15} />เปิดแผนที่
            </Link>
            <a href="mailto:hello@evrentalth.com"
              className="flex items-center gap-2 font-semibold px-6 py-3 rounded-2xl text-sm border border-gray-200 hover:border-gray-300 text-gray-700 transition-colors">
              <Mail size={15} />ติดต่อเรา
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mx-auto mb-3">
                <s.icon size={18} className="text-cyan-600" />
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-cyan-200 transition-colors">
              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center mb-4">
                <v.icon size={18} className="text-cyan-600" />
              </div>
              <h2 className="font-black text-gray-900 mb-2">{v.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">ความเป็นมา</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-px" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white shadow -translate-x-1/2 mt-1.5" />
                  {/* Content */}
                  <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">{m.year}</span>
                    <h3 className="font-bold text-gray-900 mt-1">{m.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">ทีมงาน</h2>
          <p className="text-sm text-gray-400 text-center mb-8">11 คน หลากหลายความเชี่ยวชาญ รวมพลังสร้างแพลตฟอร์ม EV ที่ดีที่สุดในไทย</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-cyan-200 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                  <m.icon size={18} />
                </div>
                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">{m.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data source */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h2 className="font-black text-gray-900 mb-3">แหล่งข้อมูล</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            ข้อมูลสถานีชาร์จรวบรวมจาก <strong>OpenStreetMap</strong> (© OpenStreetMap contributors, ODbL)
            อัปเดตแบบ real-time ข้อมูลรถ EV รวบรวมจากแหล่งข้อมูลสาธารณะและตัวแทนจำหน่ายอย่างเป็นทางการ
            แพลตฟอร์มนี้ให้บริการฟรี ไม่เชื่อมโยงกับ brand ใดเป็นการเฉพาะ
          </p>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer"
            className="text-sm text-cyan-600 font-semibold hover:underline">
            © OpenStreetMap contributors →
          </a>
        </div>

        {/* Media & Partner contact */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={16} className="text-cyan-600" />
              <h3 className="font-bold text-gray-900">สื่อมวลชน / Press</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              ต้องการข้อมูลสำหรับบทความ สัมภาษณ์ หรือข่าวสาร EV ไทย ติดต่อเราได้เลย
            </p>
            <a href="mailto:hello@evrentalth.com"
              className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:underline">
              hello@evrentalth.com <ArrowRight size={13} />
            </a>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Handshake size={16} className="text-cyan-600" />
              <h3 className="font-bold text-gray-900">พันธมิตรธุรกิจ / Partnership</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              สนใจร่วมงาน แสดงข้อมูลสถานีชาร์จ หรือ co-marketing กับเรา
            </p>
            <a href="https://line.me/ti/p/@341pmycy" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:underline">
              <MessageCircle size={13} />สอบถามทาง LINE <ArrowRight size={13} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact"
            className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-2xl text-sm transition-colors border border-gray-200 hover:border-cyan-300 text-gray-700">
            ติดต่อเราโดยตรง <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
