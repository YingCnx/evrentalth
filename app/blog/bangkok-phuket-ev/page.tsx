import { Metadata } from "next";
import Link from "next/link";
import { Navigation, MapPin, Zap, Clock, Lightbulb, Fuel } from "lucide-react";
import ArticleLayout from "../../components/ArticleLayout";

export const metadata: Metadata = {
  title: "กรุงเทพ–ภูเก็ต 862 กม. ด้วย EV – ทดสอบจริง",
  description: "ทดสอบจริงกับ Tesla Model Y ขับกรุงเทพ-ภูเก็ต 862 กม. แวะชาร์จ 3 จุด ใช้เวลาเพิ่ม 1 ชั่วโมง ค่าใช้จ่ายรวม 650 บาท",
};

const STOPS = [
  { name: "EA Anywhere ชุมพร", km: 480, fromPrev: 480, charger: "DC 120kW", time: "30 นาที", tip: "แวะกินข้าวมื้อเที่ยง เส้นทางสวย", required: true },
  { name: "EA Anywhere สุราษฎร์ธานี", km: 640, fromPrev: 160, charger: "DC 120kW", time: "20 นาที", tip: "ชาร์จสั้นๆ ระหว่างพักน้ำ", required: true },
  { name: "EA Anywhere พังงา", km: 820, fromPrev: 180, charger: "DC 50kW", time: "15 นาที", tip: "เติมนิดหน่อย ให้แบตพอถึงภูเก็ต", required: false },
];

export default function Page() {
  return (
    <ArticleLayout
      category="เส้นทาง EV" categoryColor="bg-green-100 text-green-700"
      title="กรุงเทพ → ภูเก็ต 862 กม. ด้วย EV ทำได้จริงไหม?"
      excerpt="ทดสอบจริงกับ Tesla Model Y ออกจากกรุงเทพ 6 โมงเช้า ถึงภูเก็ต 5 โมงเย็น แวะชาร์จ 3 จุด ค่าไฟรวม 650 บาท"
      author="แพร วริศรา" date="10 พ.ค. 2026" readMin={9}
      related={[
        { title: "เชียงใหม่-กรุงเทพด้วย EV", slug: "chiang-mai-bangkok-ev", category: "เส้นทาง EV" },
        { title: "วางแผนเส้นทาง EV", slug: "/map", category: "เครื่องมือ" },
      ]}
    >
      <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
        <p className="text-sm text-gray-400 mb-4">สรุปเส้นทาง กรุงเทพ → ภูเก็ต</p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div><p className="text-2xl font-black text-green-400">862</p><p className="text-xs text-gray-400">กิโลเมตร</p></div>
          <div><p className="text-2xl font-black text-blue-400">3</p><p className="text-xs text-gray-400">จุดชาร์จ</p></div>
          <div><p className="text-2xl font-black text-orange-400">65 นาที</p><p className="text-xs text-gray-400">เวลาชาร์จรวม</p></div>
          <div><p className="text-2xl font-black text-white">650 ฿</p><p className="text-xs text-gray-400">ค่าไฟรวม</p></div>
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-5">จุดชาร์จตลอดเส้นทาง</h2>
      <div className="relative mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><MapPin size={18} className="text-white" /></div>
          <div><p className="font-black text-gray-900">ต้นทาง: กรุงเทพมหานคร</p><p className="text-sm text-gray-500">ออก 06:00 น. แบตเต็ม 100%</p></div>
        </div>
        <div className="ml-5 border-l-2 border-dashed border-gray-200 pl-9">
          {STOPS.map((s, i) => (
            <div key={i} className="relative my-4">
              <div className="absolute -left-[41px] top-4">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow ${s.required ? "bg-blue-500" : "bg-gray-300"}`} />
              </div>
              <div className={`rounded-2xl border p-4 ${s.required ? "border-blue-100 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={13} className={s.required ? "text-blue-600" : "text-gray-400"} />
                      <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                      {s.required ? <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">แวะที่นี่</span>
                        : <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">ไม่บังคับ</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Lightbulb size={11} /> {s.tip}</p>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Zap size={10} />{s.charger}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{s.time}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black text-gray-900">{s.km}</p>
                    <p className="text-[10px] text-gray-400">กม.</p>
                    <p className="text-[10px] text-green-600 font-medium">+{s.fromPrev} กม.</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0"><MapPin size={18} className="text-white" /></div>
          <div><p className="font-black text-gray-900">ปลายทาง: ภูเก็ต</p><p className="text-sm text-gray-500">ถึง ~17:00 น.</p></div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
        <p className="font-black text-gray-900 mb-3">เทียบกับรถน้ำมัน</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white rounded-xl p-3"><p className="text-xs text-gray-400 flex items-center gap-1"><Fuel size={11} /> น้ำมัน (42฿/ล., 12กม./ล.)</p><p className="text-xl font-black text-red-500">3,010 ฿</p></div>
          <div className="bg-green-100 rounded-xl p-3"><p className="text-xs text-gray-400 flex items-center gap-1"><Zap size={11} /> Tesla Model Y</p><p className="text-xl font-black text-green-700">650 ฿</p></div>
        </div>
        <p className="text-center text-sm font-bold text-green-700 mt-3">ประหยัดได้ 2,360 ฿ ต่อเที่ยว (78%)</p>
      </div>

      <div className="flex gap-3">
        <Link href="/routes/bangkok-phuket" className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
          <Navigation size={15} />ดูเส้นทางนี้บนแผนที่
        </Link>
        <Link href="/map" className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm">
          วางแผนเส้นทางเอง
        </Link>
      </div>
    </ArticleLayout>
  );
}
