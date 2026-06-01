import { Metadata } from "next";
import Link from "next/link";
import { Zap, CheckCircle, AlertTriangle } from "lucide-react";
import ArticleLayout from "../../components/ArticleLayout";

export const metadata: Metadata = {
  title: "ชาร์จ EV ที่บ้าน – ค่าติดตั้ง ขั้นตอน คู่มือ",
  description: "คู่มือติดตั้งชาร์จเจอร์รถ EV ที่บ้านตั้งแต่ต้น ตรวจสอบตู้ไฟ ค่าติดตั้ง Wallbox ใช้เวลากี่ชั่วโมง",
};

export default function Page() {
  return (
    <ArticleLayout
      category="คู่มือ EV" categoryColor="bg-orange-100 text-orange-700"
      title="ชาร์จ EV ที่บ้านต้องเตรียมอะไรบ้าง? ค่าใช้จ่ายเท่าไร?"
      excerpt="คู่มือฉบับสมบูรณ์ตั้งแต่ตรวจสอบระบบไฟในบ้าน จนถึงติดตั้ง Wallbox ใช้งานได้จริง"
      author="แพร วริศรา" date="20 พ.ค. 2026" readMin={7}
      related={[
        { title: "ค่าชาร์จบ้าน vs สาธารณะ ต่างกันแค่ไหน?", slug: "charging-cost-home-vs-public", category: "ค่าชาร์จ" },
        { title: "คำนวณค่าชาร์จต่อครั้ง", slug: "/calculator/charging-cost", category: "เครื่องมือ" },
      ]}
    >
      <h2 className="text-xl font-black text-gray-900 mb-4">3 แบบการชาร์จที่บ้าน</h2>
      <div className="space-y-4 mb-8">
        {[
          { title: "1. ปลั๊ก 3 ขา บ้านทั่วไป (3.3 kW)", time: "ชาร์จเต็ม 15-20 ชม.", cost: "ไม่มีค่าติดตั้งเพิ่ม", warning: "ช้ามาก ไม่แนะนำระยะยาว", color: "border-gray-200" },
          { title: "2. Wallbox 7.4 kW (แนะนำ)", time: "ชาร์จเต็ม 6-8 ชม.", cost: "ค่าติดตั้ง 8,000-20,000 บาท", warning: null, color: "border-green-200 bg-green-50" },
          { title: "3. Wallbox 22 kW (ระดับสูง)", time: "ชาร์จเต็ม 2-3 ชม.", cost: "ค่าติดตั้ง 25,000-50,000 บาท", warning: "ต้องเปลี่ยนมิเตอร์ไฟ", color: "border-blue-200" },
        ].map(s => (
          <div key={s.title} className={`border-2 rounded-2xl p-5 ${s.color}`}>
            <p className="font-black text-gray-900 mb-2">{s.title}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-400">เวลา: </span><span className="font-medium">{s.time}</span></div>
              <div><span className="text-gray-400">ค่าใช้จ่าย: </span><span className="font-medium">{s.cost}</span></div>
            </div>
            {s.warning && <p className="text-xs text-amber-600 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> {s.warning}</p>}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-4">ขั้นตอนติดตั้ง Wallbox 7.4 kW</h2>
      <div className="space-y-3 mb-8">
        {[
          { step: "1", title: "ตรวจสอบตู้ไฟ", desc: "ต้องมี breaker ว่างขนาด 32A และสายไฟทนกระแสพอ" },
          { step: "2", title: "เลือก Wallbox", desc: "แบรนด์ดีในไทย: Wallbox Pulsar, ABB Terra, Schneider EVlink ราคา 8,000-25,000 บาท" },
          { step: "3", title: "จ้างช่างไฟ", desc: "ต้องใช้ช่างไฟที่มีใบอนุญาต ค่าแรงประมาณ 3,000-8,000 บาท" },
          { step: "4", title: "ติดตั้งและทดสอบ", desc: "ใช้เวลาประมาณ 2-4 ชั่วโมง ทดสอบชาร์จรถก่อนจ่ายเงิน" },
        ].map(s => (
          <div key={s.step} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">{s.step}</div>
            <div><p className="font-bold text-gray-900 text-sm">{s.title}</p><p className="text-xs text-gray-500 mt-0.5">{s.desc}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
        <p className="font-black text-gray-900 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green-600" />สรุปค่าใช้จ่ายทั้งหมด</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Wallbox 7.4 kW</span><span className="font-bold">8,000-15,000 ฿</span></div>
          <div className="flex justify-between"><span className="text-gray-600">ค่าสายไฟ + อุปกรณ์</span><span className="font-bold">2,000-5,000 ฿</span></div>
          <div className="flex justify-between"><span className="text-gray-600">ค่าแรงช่างไฟ</span><span className="font-bold">3,000-8,000 ฿</span></div>
          <div className="flex justify-between border-t border-green-200 pt-2 mt-2"><span className="font-bold text-gray-800">รวมทั้งหมด</span><span className="font-black text-green-700">13,000-28,000 ฿</span></div>
        </div>
      </div>

      <Link href="/chargers" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors">
        <Zap size={16} />ดูสถานีชาร์จสาธารณะใกล้บ้าน
      </Link>
    </ArticleLayout>
  );
}
