import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Car, Zap, Check } from "lucide-react";
import ArticleLayout from "../../components/ArticleLayout";

export const metadata: Metadata = {
  title: "BYD Dolphin vs MG4 Electric – เปรียบเทียบ EV ราคาใกล้กัน",
  description: "เปรียบเทียบ BYD Dolphin กับ MG4 Electric สเปค ระยะทาง ความเร็วชาร์จ ค่าซ่อม ใครขับ Grab ควรเลือกอะไร",
};

export default function Page() {
  return (
    <ArticleLayout
      category="เปรียบเทียบรถ" categoryColor="bg-purple-100 text-purple-700"
      title="BYD Dolphin vs MG4 Electric ราคาใกล้กัน คุ้มกว่ากัน?"
      excerpt="สองรุ่นยอดนิยมราคา 7-9 แสน สเปคต่างกันไหม ใครเหมาะกับการใช้งานแบบไหน"
      author="แพร วริศรา" date="25 พ.ค. 2026" readMin={10}
      related={[
        { title: "เปรียบเทียบรถ EV ทุกรุ่น", slug: "/cars/compare?cars=byd-dolphin,mg4-electric", category: "เครื่องมือ" },
        { title: "คำนวณคืนทุน EV vs น้ำมัน", slug: "/calculator", category: "เครื่องมือ" },
      ]}
    >
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { name: "BYD Dolphin", price: "699K-799K", range: "490 กม.", dc: "60 kW", charge: "40 นาที", grab: true, color: "border-blue-200 bg-blue-50" },
          { name: "MG4 Electric", price: "979K-1.28M", range: "425 กม.", dc: "135 kW", charge: "26 นาที", grab: true, color: "border-red-200 bg-red-50" },
        ].map(c => (
          <div key={c.name} className={`rounded-2xl border-2 p-5 ${c.color}`}>
            <p className="font-black text-gray-900 text-lg mb-3">{c.name}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">ราคา</span><span className="font-bold">{c.price}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ระยะทาง</span><span className="font-bold">{c.range}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">DC ชาร์จ</span><span className="font-bold">{c.dc}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">10-80%</span><span className="font-bold">{c.charge}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ขับ Grab</span><span><Check size={14} className="text-green-500 inline" /></span></div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-3">ราคา — Dolphin ถูกกว่าชัดเจน</h2>
      <p className="text-gray-600 leading-relaxed mb-6">BYD Dolphin เริ่ม <strong>699,000 บาท</strong> ขณะที่ MG4 เริ่ม <strong>979,000 บาท</strong> ต่างกันถึง 280,000 บาท ถ้างบจำกัด Dolphin ชนะชัดเจน</p>

      <h2 className="text-xl font-black text-gray-900 mb-3">ชาร์จเร็ว — MG4 ชนะขาด</h2>
      <p className="text-gray-600 leading-relaxed mb-6">MG4 รองรับ DC <strong>135 kW</strong> ชาร์จ 10-80% ใน <strong>26 นาที</strong> ขณะที่ Dolphin รับได้แค่ <strong>60 kW</strong> ใช้เวลา 40 นาที สำหรับคนเดินทางไกลบ่อย MG4 ได้เปรียบมาก</p>

      <h2 className="text-xl font-black text-gray-900 mb-3">ระยะทาง — Dolphin ไกลกว่านิดหน่อย</h2>
      <p className="text-gray-600 leading-relaxed mb-6">Dolphin วิ่งได้ <strong>490 กม.</strong> vs MG4 <strong>425 กม.</strong> ต่างกัน 65 กม. ในการใช้งานจริงอาจไม่ต่างมาก แต่ถ้าเดินทางกรุงเทพ-ชะอำ Dolphin สบายใจกว่า</p>

      <h2 className="text-xl font-black text-gray-900 mb-3">สรุป: ใครควรเลือกอะไร</h2>
      <div className="space-y-3 mb-8">
        {[
          { icon: Car, title: "เลือก BYD Dolphin ถ้า...", points: ["งบไม่เกิน 8 แสน", "ขับในเมืองเป็นหลัก", "ชาร์จที่บ้านทุกคืน", "ขับ Grab / รถรับจ้าง"], color: "bg-blue-50 border-blue-200", iconColor: "text-blue-600" },
          { icon: Zap, title: "เลือก MG4 ถ้า...", points: ["เดินทางไกลบ่อย", "ต้องการชาร์จเร็ว DC", "งบมากกว่า 9 แสน", "ชอบดีไซน์สปอร์ต"], color: "bg-red-50 border-red-200", iconColor: "text-red-500" },
        ].map(s => (
          <div key={s.title} className={`border rounded-2xl p-5 ${s.color}`}>
            <p className="font-black text-gray-900 mb-2 flex items-center gap-2"><s.icon size={16} className={s.iconColor} />{s.title}</p>
            <ul className="space-y-1">{s.points.map(p => <li key={p} className="text-sm text-gray-700 flex items-center gap-2"><Check size={13} className="text-green-500" />{p}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/cars/compare?cars=byd-dolphin,mg4-electric"
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
          เปรียบเทียบ spec เคียงกัน <ChevronRight size={14} />
        </Link>
        <Link href="/cars"
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm">
          ดูรถ EV ทุกรุ่น
        </Link>
      </div>
    </ArticleLayout>
  );
}
