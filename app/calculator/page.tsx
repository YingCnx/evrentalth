import { Metadata } from "next";
import PageLayout from "../components/PageLayout";
import CalculatorClient from "../components/CalculatorClient";

export const metadata: Metadata = {
  title: "คำนวณคืนทุน EV – เทียบกับรถน้ำมัน",
  description: "คำนวณว่าซื้อรถ EV แทนรถน้ำมันคืนทุนกี่ปี ใส่ระยะทางต่อวัน ราคาน้ำมัน เลือกรุ่น EV แล้วดูผลได้ทันที",
  keywords: ["ev คืนทุนกี่ปี", "รถ ev คุ้มไหม", "ประหยัดน้ำมัน ev", "คำนวณ ev vs น้ำมัน"],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "รถ EV คืนทุนกี่ปี?",
      acceptedAnswer: { "@type": "Answer", text: "ขึ้นอยู่กับระยะทางต่อวัน หากขับ 80-100 กม./วัน เช่น Grab คืนทุนภายใน 3-5 ปี สำหรับผู้ขับปกติ 40-60 กม./วัน อาจใช้เวลา 6-8 ปี" },
    },
    {
      "@type": "Question",
      name: "ค่าชาร์จรถ EV ต่อกิโลเมตรเท่าไร?",
      acceptedAnswer: { "@type": "Answer", text: "ชาร์จที่บ้านอยู่ที่ประมาณ 1-1.5 บาท/กม. ชาร์จที่สถานีสาธารณะประมาณ 1.5-2.5 บาท/กม. เทียบกับน้ำมัน 3-4 บาท/กม." },
    },
    {
      "@type": "Question",
      name: "รถ EV เหมาะกับใคร?",
      acceptedAnswer: { "@type": "Answer", text: "เหมาะกับผู้ขับรถในเมืองเป็นประจำ มีที่จอดรถสำหรับชาร์จที่บ้าน หรือขับเป็นระยะทางสม่ำเสมอ เช่น Grab, พนักงานออฟฟิศ, รถครอบครัว" },
    },
    {
      "@type": "Question",
      name: "ค่าบำรุงรักษารถ EV แพงกว่ารถน้ำมันไหม?",
      acceptedAnswer: { "@type": "Answer", text: "ค่าบำรุงรักษาถูกกว่าอย่างมีนัยสำคัญ ไม่มีการเปลี่ยนน้ำมันเครื่อง กรองน้ำมัน หัวเทียน ประมาณการว่าประหยัดได้ 15,000-25,000 บาท/ปี" },
    },
  ],
};

export default function CalculatorPage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <CalculatorClient />
    </PageLayout>
  );
}
