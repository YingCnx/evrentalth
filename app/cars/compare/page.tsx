import { Metadata } from "next";
import PageLayout from "../../components/PageLayout";
import CompareClient from "../../components/CompareClient";

export const metadata: Metadata = {
  title: "เปรียบเทียบรถ EV เคียงข้าง – เลือกรุ่นที่ใช่",
  description: "เปรียบเทียบสเปครถยนต์ไฟฟ้าเคียงข้างกัน ราคา ระยะทาง ความเร็วชาร์จ แบตเตอรี่ เลือกรุ่นที่ใช่สำหรับคุณ",
};

export default function ComparePage() {
  return (
    <PageLayout>
      <CompareClient />
    </PageLayout>
  );
}
