import { Metadata } from "next";
import Link from "next/link";
import { Battery, CheckCircle } from "lucide-react";
import ArticleLayout from "../../components/ArticleLayout";

export const metadata: Metadata = {
  title: "แบตเตอรี่ EV เสื่อมกี่ปี – ข้อเท็จจริงและค่าเปลี่ยน",
  description: "ตอบทุกข้อสงสัยเรื่องแบตรถ EV เสื่อมกี่เปอร์เซ็นต่อปี รับประกันกี่ปี ค่าเปลี่ยนเท่าไร ควรกลัวไหม",
};

export default function Page() {
  return (
    <ArticleLayout
      category="คู่มือ EV" categoryColor="bg-orange-100 text-orange-700"
      title="แบตเตอรี่ EV เสื่อมไวไหม? ต้องเปลี่ยนกี่ปี?"
      excerpt="คำถามที่คนกลัวที่สุดก่อนซื้อ EV ตอบตรงๆ จากข้อมูลจริงทั้งไทยและต่างประเทศ"
      author="แพร วริศรา" date="15 พ.ค. 2026" readMin={6}
      related={[
        { title: "เปรียบเทียบรถ EV ทุกรุ่น", slug: "/cars", category: "รถ EV" },
        { title: "คำนวณคืนทุน EV vs น้ำมัน", slug: "/calculator", category: "เครื่องมือ" },
      ]}
    >
      <h2 className="text-xl font-black text-gray-900 mb-4">ข้อมูลจริงเรื่องแบตเสื่อม</h2>
      <div className="bg-gray-950 text-white rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-black text-green-400">1-2%</p><p className="text-xs text-gray-400">เสื่อมต่อปี (เฉลี่ย)</p></div>
          <div><p className="text-2xl font-black text-blue-400">8-10 ปี</p><p className="text-xs text-gray-400">อายุใช้งานจริง</p></div>
          <div><p className="text-2xl font-black text-orange-400">70-80%</p><p className="text-xs text-gray-400">ความจุหลัง 10 ปี</p></div>
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-3">แบตเสื่อมเร็วแค่ไหนในสภาพอากาศไทย?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">ไทยอากาศร้อน ซึ่งเป็นศัตรูของแบตเตอรี่ลิเทียม แต่รถ EV สมัยใหม่มีระบบ <strong>Battery Thermal Management</strong> ที่ควบคุมอุณหภูมิแบตให้อยู่ในช่วงเหมาะสม จากข้อมูลในไทย แบตเสื่อมประมาณ <strong>2-3% ต่อปี</strong> ในสภาพอากาศบ้านเรา</p>

      <h2 className="text-xl font-black text-gray-900 mb-3">การรับประกันแบต</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-50"><th className="text-left p-3 font-bold text-gray-700">แบรนด์</th><th className="text-center p-3 font-bold text-gray-700">รับประกัน</th><th className="text-center p-3 font-bold text-gray-700">เงื่อนไข</th></tr></thead>
          <tbody>
            {[["BYD","8 ปี / 150,000 กม.","ความจุไม่ต่ำกว่า 70%"],["MG","8 ปี / 160,000 กม.","ความจุไม่ต่ำกว่า 70%"],["Tesla","8 ปี / 160,000-240,000 กม.","ตามรุ่น"],["Neta","8 ปี / 150,000 กม.","ความจุไม่ต่ำกว่า 70%"]].map(([brand,warranty,condition]) => (
              <tr key={brand} className="border-t border-gray-100">
                <td className="p-3 font-bold text-gray-800">{brand}</td>
                <td className="p-3 text-center text-green-700 font-medium">{warranty}</td>
                <td className="p-3 text-center text-gray-500 text-xs">{condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-3">ถ้าแบตเสื่อมแล้วเปลี่ยนค่าเท่าไร?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">ค่าเปลี่ยนแบตในไทยตอนนี้อยู่ที่ประมาณ <strong>200,000-400,000 บาท</strong> แล้วแต่รุ่น แต่ราคาแบตลดลงทุกปี คาดว่าในอีก 8-10 ปีจะเหลือแค่ <strong>100,000-200,000 บาท</strong></p>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
        <p className="font-black text-green-800 mb-2 flex items-center gap-2"><CheckCircle size={16} className="text-green-600" /> สรุป: ควรกลัวเรื่องแบตไหม?</p>
        <p className="text-sm text-gray-700 leading-relaxed">ถ้าซื้อรถยี่ห้อดังและใช้งานปกติ <strong>ไม่ต้องกลัวครับ</strong> แบตรับประกัน 8 ปี หลังจากนั้นแม้เสื่อมก็ยังวิ่งได้ ประหยัดกว่าน้ำมัน และราคาเปลี่ยนแบตจะถูกลงเรื่อยๆ</p>
      </div>

      <Link href="/cars" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors">
        <Battery size={16} />ดูสเปคแบตรถ EV ทุกรุ่น
      </Link>
    </ArticleLayout>
  );
}
