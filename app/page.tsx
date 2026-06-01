import { Metadata } from "next";
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  title: "EV Charge Map Thailand — แผนที่จุดชาร์จ วางแผนเส้นทาง เปรียบเทียบรถ EV",
  description:
    "แพลตฟอร์ม EV ครบวงจรสำหรับคนไทย แผนที่จุดชาร์จ 3,200+ แห่งทั่วประเทศ วางแผนเส้นทาง EV เปรียบเทียบสเปครถ และคำนวณความคุ้มค่า — ฟรี ไม่ต้องสมัครสมาชิก",
  keywords: ["จุดชาร์จ EV", "รถไฟฟ้า", "แผนที่ชาร์จ", "EV Thailand", "charging station thailand", "วางแผนเส้นทาง EV"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "EV Charge Map Thailand",
    description: "แผนที่จุดชาร์จ วางแผนเส้นทาง เปรียบเทียบรถ EV ครบวงจร",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
