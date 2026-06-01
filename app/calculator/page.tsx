import { Metadata } from "next";
import PageLayout from "../components/PageLayout";
import CalculatorClient from "../components/CalculatorClient";

export const metadata: Metadata = {
  title: "คำนวณคืนทุน EV – เทียบกับรถน้ำมัน",
  description: "คำนวณว่าซื้อรถ EV แทนรถน้ำมันคืนทุนกี่ปี ใส่ระยะทางต่อวัน ราคาน้ำมัน เลือกรุ่น EV แล้วดูผลได้ทันที",
  keywords: ["ev คืนทุนกี่ปี", "รถ ev คุ้มไหม", "ประหยัดน้ำมัน ev", "คำนวณ ev vs น้ำมัน"],
};

export default function CalculatorPage() {
  return (
    <PageLayout>
      <CalculatorClient />
    </PageLayout>
  );
}
