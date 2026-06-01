import { Metadata } from "next";
import Link from "next/link";
import { Zap, Battery, Home, Moon } from "lucide-react";
import ArticleLayout from "../../components/ArticleLayout";

export const metadata: Metadata = {
  title: "ค่าชาร์จ EV ที่บ้าน vs สถานีสาธารณะ ต่างกันแค่ไหน? | EV Charge Map",
  description: "เปรียบเทียบค่าไฟบ้าน TOU 4.5 ฿/kWh กับ EA Anywhere 6.5 ฿/kWh ชาร์จที่ไหนถูกกว่า คุ้มค่ากว่า",
};

export default function Page() {
  return (
    <ArticleLayout
      category="ค่าชาร์จ" categoryColor="bg-blue-100 text-blue-700"
      title="ค่าชาร์จ EV ที่บ้าน vs สถานีสาธารณะ ต่างกันแค่ไหน?"
      excerpt="คำถามที่เจ้าของรถ EV ทุกคนอยากรู้ ชาร์จที่ไหนถูกกว่า และควรวางแผนการชาร์จยังไงให้ประหยัดสุด"
      author="แพร วริศรา" date="28 พ.ค. 2026" readMin={5}
      related={[
        { title: "คำนวณค่าชาร์จต่อครั้ง", slug: "#", category: "เครื่องมือ" },
        { title: "เปรียบเทียบค่าบริการทุกเครือข่าย", slug: "#", category: "ค่าชาร์จ" },
      ]}
    >
      <h2 className="text-xl font-black text-gray-900 mt-0 mb-4">สรุปสั้นๆ ก่อนอ่าน</h2>
      <div className="bg-gray-950 text-white rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-black text-green-400">4-5 ฿</p><p className="text-xs text-gray-400">ชาร์จบ้าน /kWh</p></div>
          <div><p className="text-2xl font-black text-blue-400">6.5-8.5 ฿</p><p className="text-xs text-gray-400">สาธารณะ /kWh</p></div>
          <div><p className="text-2xl font-black text-orange-400">40-50%</p><p className="text-xs text-gray-400">ถูกกว่าถ้าชาร์จบ้าน</p></div>
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-3">ชาร์จที่บ้าน — ถูกที่สุด</h2>
      <p className="text-gray-600 leading-relaxed mb-4">ค่าไฟบ้านในไทยอยู่ที่ประมาณ <strong>3.5-5.5 บาท/kWh</strong> ขึ้นอยู่กับปริมาณการใช้และช่วงเวลา ถ้าใช้ TOU (Time of Use) ชาร์จช่วงดึก 23:00-09:00 จะได้ราคาถูกสุดประมาณ <strong>2.6-3.0 บาท/kWh</strong></p>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-green-800 mb-2">ตัวอย่าง: BYD Dolphin (แบต 60 kWh)</p>
        <div className="space-y-1 text-sm text-gray-700">
          <p>• ชาร์จบ้านปกติ: 60 × 4.5 = <strong>270 บาท</strong> (วิ่งได้ 490 กม.)</p>
          <p>• ชาร์จบ้าน TOU กลางคืน: 60 × 2.8 = <strong>168 บาท</strong></p>
          <p>• ต้นทุนต่อกม.: <strong>0.55 บาท/กม.</strong></p>
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-3">ชาร์จสาธารณะ — สะดวก แต่แพงกว่า</h2>
      <p className="text-gray-600 leading-relaxed mb-4">สถานีชาร์จสาธารณะในไทยคิดราคา <strong>6-9 บาท/kWh</strong> แล้วแต่เครือข่าย โดย BYD Charging ถูกสุด 6 บาท และ Sharge แพงสุด 8.5 บาท</p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-50"><th className="text-left p-3 font-bold text-gray-700 rounded-tl-xl">เครือข่าย</th><th className="text-center p-3 font-bold text-gray-700">฿/kWh</th><th className="text-center p-3 font-bold text-gray-700 rounded-tr-xl">ชาร์จ 60 kWh</th></tr></thead>
          <tbody>
            {[["BYD Charging","6","360 ฿"],["EA Anywhere","6.5","390 ฿"],["PTT EV Station","7","420 ฿"],["Plugify","7.5","450 ฿"],["Sharge","8.5","510 ฿"]].map(([name,price,total]) => (
              <tr key={name} className="border-t border-gray-100">
                <td className="p-3 text-gray-800">{name}</td>
                <td className="p-3 text-center font-bold">{price}</td>
                <td className="p-3 text-center text-gray-600">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-3">สรุป: ควรชาร์จที่ไหน?</h2>
      <div className="space-y-3 mb-6">
        {[
          { icon: Home, title: "ชาร์จบ้านทุกคืน", desc: "ดีที่สุด ถูกที่สุด เหมาะถ้าขับในเมืองและกลับบ้านทุกวัน", color: "bg-green-100 text-green-600" },
          { icon: Zap, title: "ชาร์จสาธารณะเมื่อจำเป็น", desc: "ระหว่างเดินทางไกล หรือเมื่อแบตจะหมดระหว่างวัน", color: "bg-blue-100 text-blue-600" },
          { icon: Moon, title: "TOU กลางคืน = ประหยัดสุด", desc: "ตั้ง timer ชาร์จ 23:00-09:00 ได้ราคาพิเศษจาก PEA/MEA", color: "bg-indigo-100 text-indigo-600" },
        ].map(s => (
          <div key={s.title} className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}><s.icon size={18} /></div>
            <div><p className="font-bold text-gray-900 text-sm">{s.title}</p><p className="text-xs text-gray-500 mt-0.5">{s.desc}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Link href="/calculator/charging-cost" className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
          <Zap size={15} />คำนวณค่าชาร์จของรถคุณ
        </Link>
        <Link href="/chargers/pricing" className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm">
          <Battery size={15} />เปรียบเทียบค่าบริการ
        </Link>
      </div>
    </ArticleLayout>
  );
}
