import { Metadata } from "next";
import EVChargeApp from "./components/EVChargeApp";

export const metadata: Metadata = {
  title: "ค้นหาจุดชาร์จรถไฟฟ้าทั่วไทย | EV Charging Station Map Thailand",
  description:
    "แผนที่จุดชาร์จรถไฟฟ้าทั่วประเทศไทย ค้นหาตามจังหวัด กรองตามประเภทหัวชาร์จ AC DC Fast Charge ดูสถานะและราคาได้ทันที — Interactive map of EV charging stations across Thailand. Search by province, filter by connector type.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return (
    <>
      {/* SEO hidden heading — visible to crawlers, hidden from UI */}
      <h1 className="sr-only">
        แผนที่จุดชาร์จรถไฟฟ้าทั่วประเทศไทย — EV Charging Station Map Thailand
      </h1>
      <p className="sr-only">
        ค้นหาสถานีชาร์จรถยนต์ไฟฟ้า (EV Charging Station) ทั่วไทย ครอบคลุมทุกจังหวัด
        รองรับหัวชาร์จ Type 1, Type 2, CCS, CHAdeMO, Fast Charge ดูสถานะว่าง/ไม่ว่าง
        ราคาต่อหน่วย และนำทางผ่าน Google Maps ได้ทันที — Find EV charging stations
        across Thailand including Bangkok, Chiang Mai, Phuket, Pattaya, and more.
        Supports Type 1, Type 2, CCS2, CHAdeMO, and DC Fast Charging connectors.
      </p>
      <EVChargeApp />
    </>
  );
}
