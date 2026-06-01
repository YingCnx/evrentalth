import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import PageLayout from "../components/PageLayout";

export const metadata: Metadata = {
  title: "บทความ EV ไทย — คู่มือ รีวิว เส้นทาง | EV Charge Map",
  description: "รวมบทความรถยนต์ไฟฟ้า คู่มือชาร์จ รีวิวเส้นทาง EV ทั่วไทย อัปเดตทุกสัปดาห์โดยทีมผู้เชี่ยวชาญ",
};

const ARTICLES = [
  {
    slug: "chiang-mai-bangkok-ev",
    title: "เชียงใหม่ → กรุงเทพด้วยรถ EV ต้องแวะชาร์จที่ไหนบ้าง?",
    excerpt: "ระยะทาง 696 กม. ทดลองขับจริง 4 รอบ บอกทุกจุดชาร์จที่ต้องรู้ EA Anywhere, PTT EV ใช้เวลาเพิ่มแค่ 40 นาที",
    category: "เส้นทาง EV",
    categoryColor: "bg-green-100 text-green-700",
    readMin: 8,
    date: "1 มิ.ย. 2026",
    author: "แพร วริศรา",
  },
  {
    slug: "charging-cost-home-vs-public",
    title: "ค่าชาร์จ EV ที่บ้าน vs สถานีสาธารณะ ต่างกันแค่ไหน?",
    excerpt: "เปรียบเทียบค่าไฟบ้าน TOU 4.5 ฿/kWh กับ EA Anywhere 6.5 ฿/kWh ชาร์จที่ไหนถูกกว่ากัน",
    category: "ค่าชาร์จ",
    categoryColor: "bg-blue-100 text-blue-700",
    readMin: 5,
    date: "28 พ.ค. 2026",
    author: "แพร วริศรา",
  },
  {
    slug: "byd-dolphin-vs-mg4",
    title: "BYD Dolphin vs MG4 Electric ราคาใกล้กัน คุ้มกว่ากัน?",
    excerpt: "สเปคเทียบสเปค ระยะทาง ความเร็วชาร์จ ค่าซ่อม ใครใช้ Grab ควรเลือกอะไร",
    category: "เปรียบเทียบรถ",
    categoryColor: "bg-purple-100 text-purple-700",
    readMin: 10,
    date: "25 พ.ค. 2026",
    author: "แพร วริศรา",
  },
  {
    slug: "ev-home-charging",
    title: "ชาร์จ EV ที่บ้านต้องเตรียมอะไรบ้าง? ค่าใช้จ่ายเท่าไร?",
    excerpt: "ตั้งแต่ตรวจสอบตู้ไฟ ไปจนถึงติดตั้ง Wallbox 7.4kW ค่าใช้จ่ายรวมประมาณ 15,000-25,000 บาท",
    category: "คู่มือ EV",
    categoryColor: "bg-orange-100 text-orange-700",
    readMin: 7,
    date: "20 พ.ค. 2026",
    author: "แพร วริศรา",
  },
  {
    slug: "ev-battery-lifespan",
    title: "แบตเตอรี่ EV เสื่อมไวไหม? ต้องเปลี่ยนกี่ปี?",
    excerpt: "ตอบทุกข้อสงสัยที่คนกลัวก่อนซื้อ EV แบตเสื่อมกี่% ต่อปี รับประกันกี่ปี ค่าเปลี่ยนเท่าไร",
    category: "คู่มือ EV",
    categoryColor: "bg-orange-100 text-orange-700",
    readMin: 6,
    date: "15 พ.ค. 2026",
    author: "แพร วริศรา",
  },
  {
    slug: "bangkok-phuket-ev",
    title: "กรุงเทพ → ภูเก็ต 862 กม. ด้วย EV ทำได้จริงไหม?",
    excerpt: "ทดสอบจริงกับ Tesla Model Y แวะชาร์จ 3 จุด ใช้เวลาเพิ่ม 1 ชั่วโมง ค่าใช้จ่ายรวม 650 บาท",
    category: "เส้นทาง EV",
    categoryColor: "bg-green-100 text-green-700",
    readMin: 9,
    date: "10 พ.ค. 2026",
    author: "แพร วริศรา",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = ARTICLES;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">บทความ EV</h1>
          <p className="text-gray-500">คู่มือ รีวิว และเส้นทาง EV ทั่วไทย อัปเดตทุกสัปดาห์</p>
        </div>

        {/* Featured */}
        <Link href={`/blog/${featured.slug}`}
          className="block bg-gray-950 text-white rounded-3xl p-8 mb-8 hover:bg-gray-900 transition-colors group">
          <span className={`text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block ${featured.categoryColor}`}>{featured.category}</span>
          <h2 className="text-2xl font-black mb-3 group-hover:text-green-400 transition-colors">{featured.title}</h2>
          <p className="text-gray-400 mb-4 max-w-2xl">{featured.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{featured.author}</span>
            <span className="flex items-center gap-1"><Clock size={13} />{featured.readMin} นาที</span>
            <span>{featured.date}</span>
            <span className="ml-auto flex items-center gap-1 text-green-400 font-semibold">อ่านบทความ <ChevronRight size={15} /></span>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(a => (
            <Link key={a.title} href={`/blog/${a.slug}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-md transition-all group">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block ${a.categoryColor}`}>{a.category}</span>
              <h2 className="font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">{a.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{a.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={11} />{a.readMin} นาที</span>
                <span>{a.date}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-6 py-3 rounded-2xl text-sm">
            <BookOpen size={15} />บทความใหม่ทุกวันพุธ
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
