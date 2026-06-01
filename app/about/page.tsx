import { Metadata } from "next";
import Link from "next/link";
import { Zap, Users, Target, Heart, Code2, Database, Palette, FlaskConical, Search, PenLine, Film, Megaphone, Handshake, Briefcase, type LucideIcon } from "lucide-react";
import PageLayout from "../components/PageLayout";

export const metadata: Metadata = {
  title: "เกี่ยวกับ EV Charge Map Thailand | ทีมงานและพันธกิจ",
  description: "EV Charge Map Thailand แพลตฟอร์ม EV ครบวงจรสำหรับคนไทย พันธกิจ ทีมงาน และวิสัยทัศน์ของเรา",
};

const TEAM: { name: string; role: string; icon: LucideIcon; color: string }[] = [
  { name: "ภูมิ วงศ์เทพ", role: "Full-stack Developer", icon: Code2, color: "bg-blue-100 text-blue-600" },
  { name: "นัท สิริมงคล", role: "Data Engineer", icon: Database, color: "bg-indigo-100 text-indigo-600" },
  { name: "มิ้นท์ จันทร์เพ็ญ", role: "UX/UI Designer", icon: Palette, color: "bg-pink-100 text-pink-600" },
  { name: "เบส ธีรพงศ์", role: "QA Tester", icon: FlaskConical, color: "bg-amber-100 text-amber-600" },
  { name: "ก้อง ธนพล", role: "SEO Specialist", icon: Search, color: "bg-green-100 text-green-600" },
  { name: "แพร วริศรา", role: "EV Content Writer", icon: PenLine, color: "bg-teal-100 text-teal-600" },
  { name: "เจมส์ ปณิธาน", role: "Video Creator", icon: Film, color: "bg-red-100 text-red-600" },
  { name: "ฝน ชลธิชา", role: "Digital Marketing", icon: Megaphone, color: "bg-orange-100 text-orange-600" },
  { name: "บอส ศุภวิชญ์", role: "Community Manager", icon: Users, color: "bg-cyan-100 text-cyan-600" },
  { name: "อาย ปริยากร", role: "Partnership Manager", icon: Handshake, color: "bg-violet-100 text-violet-600" },
  { name: "ต้น วีรภัทร", role: "Business Development", icon: Briefcase, color: "bg-gray-100 text-gray-600" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
            <Zap size={30} className="text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">EV Charge Map Thailand</h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            แพลตฟอร์ม EV ครบวงจรสำหรับคนไทย เราเชื่อว่าการเดินทางด้วย EV ควรเป็นเรื่องง่ายสำหรับทุกคน
          </p>
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {[
            { icon: Target, title: "พันธกิจ", desc: "ทำให้การเดินทางด้วยรถ EV ในไทยง่ายขึ้น ด้วยข้อมูลที่ถูกต้อง ครบถ้วน และ real-time" },
            { icon: Heart, title: "วิสัยทัศน์", desc: "เป็น Super App สำหรับชาว EV ไทย ตั้งแต่หาจุดชาร์จ ไปจนถึงตัดสินใจซื้อรถ" },
            { icon: Users, title: "ชุมชน", desc: "สร้างชุมชนชาว EV ไทยที่แข็งแกร่ง แบ่งปันประสบการณ์และช่วยเหลือกัน" },
          ].map(v => (
            <div key={v.title} className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <v.icon size={22} className="text-green-600" />
              </div>
              <h2 className="font-black text-gray-900 mb-2">{v.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">ทีมงาน</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEAM.map(m => (
              <div key={m.name} className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-green-200 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${m.color}`}>
                  <m.icon size={20} />
                </div>
                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data source */}
        <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8">
          <p className="font-black text-gray-900 mb-2">แหล่งข้อมูล</p>
          <p className="text-sm text-gray-500 mb-3">ข้อมูลสถานีชาร์จจาก <strong>OpenStreetMap</strong> อัปเดต real-time ข้อมูลรถ EV รวบรวมจากแหล่งข้อมูลสาธารณะและตัวแทนจำหน่ายอย่างเป็นทางการ</p>
          <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer"
            className="text-sm text-green-600 font-semibold hover:underline">© OpenStreetMap contributors</a>
        </div>

        <div className="text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl transition-colors">
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
