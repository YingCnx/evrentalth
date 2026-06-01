import { Metadata } from "next";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import PageLayout from "../components/PageLayout";

export const metadata: Metadata = {
  title: "ติดต่อเรา – รายงานข้อมูลและความร่วมมือ",
  description: "ติดต่อทีมงาน EV Charge Map Thailand สำหรับความร่วมมือ รายงานข้อมูลผิดพลาด หรือข้อเสนอแนะ",
};

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-3">ติดต่อเรา</h1>
          <p className="text-gray-500">มีคำถาม ข้อเสนอแนะ หรืออยากร่วมงานกัน? ยินดีรับฟังเสมอครับ</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Mail, title: "อีเมล", value: "hello@evrentalth.com", sub: "ตอบภายใน 24 ชั่วโมง" },
            { icon: MessageCircle, title: "LINE OA", value: "@EVChargeMapTH", sub: "ตอบเร็วที่สุด" },
            { icon: MapPin, title: "ที่ตั้ง", value: "กรุงเทพมหานคร", sub: "ประเทศไทย" },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <c.icon size={18} className="text-green-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">{c.title}</p>
              <p className="text-sm text-green-600 font-semibold">{c.value}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-black text-gray-900 mb-5">ส่งข้อความ</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">ชื่อ</label>
                <input type="text" placeholder="ชื่อของคุณ" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">อีเมล</label>
                <input type="email" placeholder="email@example.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">หัวข้อ</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                <option>รายงานข้อมูลผิดพลาด</option>
                <option>ข้อเสนอแนะ / Feature request</option>
                <option>ความร่วมมือทางธุรกิจ</option>
                <option>สื่อมวลชน / Press</option>
                <option>อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">ข้อความ</label>
              <textarea rows={4} placeholder="เขียนข้อความของคุณที่นี่..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 resize-none" />
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors">
              ส่งข้อความ
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
