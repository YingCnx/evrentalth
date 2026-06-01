import { Metadata } from "next";
import { Suspense } from "react";
import EVChargeApp from "../components/EVChargeApp";

export const metadata: Metadata = {
  title: "แผนที่จุดชาร์จ EV ทั่วไทย | EV Charge Map Thailand",
  description:
    "แผนที่จุดชาร์จรถไฟฟ้าทั่วประเทศไทย ค้นหาตามจังหวัด กรองตามประเภทหัวชาร์จ AC DC Fast Charge วางแผนเส้นทาง EV ได้ทันที",
};

export default function MapPage() {
  return (
    <>
      <h1 className="sr-only">แผนที่จุดชาร์จรถไฟฟ้าทั่วประเทศไทย</h1>
      <Suspense>
        <EVChargeApp />
      </Suspense>
    </>
  );
}
