// ภูมิ วงศ์เทพ — Full-stack Developer
// วันที่ 1: หน้าเปรียบเทียบรถ EV ทุกรุ่นในไทย

import { Metadata } from "next";
import CarsPage from "../components/CarsPage";

export const metadata: Metadata = {
  title: "เปรียบเทียบรถ EV ทุกรุ่นในไทย 2024-2025 | EV Charge Map",
  description:
    "เปรียบเทียบสเปครถยนต์ไฟฟ้าทุกรุ่นที่ขายในไทย BYD, MG, Neta, Tesla, GWM, Volvo, BMW ดูราคา ระยะทาง เวลาชาร์จ ครบในที่เดียว",
  keywords: ["เปรียบเทียบรถ EV", "รถไฟฟ้าราคา", "BYD ราคา", "MG EV สเปค", "รถยนต์ไฟฟ้าไทย 2024"],
};

export default function Page() {
  return <CarsPage />;
}
