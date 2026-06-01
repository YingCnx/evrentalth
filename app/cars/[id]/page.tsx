import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Battery, Zap, Clock, Users, ChevronRight, Navigation, ArrowLeft, Car as CarIcon } from "lucide-react";
import { EV_CARS, SEGMENTS, formatPrice } from "../../lib/cars";
import PageLayout from "../../components/PageLayout";

export async function generateStaticParams() {
  return EV_CARS.map(c => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = EV_CARS.find(c => c.id === id);
  if (!car) return {};
  return {
    title: `${car.brand} ${car.model} สเปค ราคา รีวิว | EV Charge Map`,
    description: `${car.brand} ${car.model} ราคา ${formatPrice(car.priceMin)} ระยะทาง ${car.rangeKm} กม. ชาร์จ DC ${car.chargeDcKw}kW ครบทุกสเปคที่ต้องรู้ก่อนซื้อ`,
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = EV_CARS.find(c => c.id === id);
  if (!car) notFound();

  const similar = EV_CARS.filter(c => c.segment === car.segment && c.id !== car.id).slice(0, 3);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft size={15} /> กลับหน้าเปรียบเทียบรถ
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Image */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center h-64 relative">
            <div className="text-8xl font-black text-gray-200">{car.brand[0]}</div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg text-gray-600">{SEGMENTS[car.segment]}</span>
              {car.grabFriendly && <span className="text-xs font-bold bg-green-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1"><CarIcon size={11} /> Grab OK</span>}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-green-600 font-bold text-sm mb-1">{car.brand}</p>
            <h1 className="text-4xl font-black text-gray-900 mb-2">{car.model}</h1>
            <p className="text-gray-500 mb-4">{car.highlight}</p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">ราคาเริ่มต้น</p>
              <p className="text-3xl font-black text-gray-900">{formatPrice(car.priceMin)}</p>
              {car.priceMax !== car.priceMin && (
                <p className="text-sm text-gray-400">ถึง {formatPrice(car.priceMax)}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Link href="/map" className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
                <Navigation size={15} />หาจุดชาร์จใกล้ฉัน
              </Link>
              <Link href={`/cars/compare?cars=${car.id}`} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-green-300 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm">
                เปรียบเทียบ
              </Link>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <h2 className="text-xl font-black text-gray-900 mb-4">สเปคทั้งหมด</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Battery, label: "ระยะทาง (WLTP)", value: `${car.rangeKm} กม.`, color: "bg-green-50 text-green-600" },
            { icon: Zap, label: "DC Fast Charge", value: `${car.chargeDcKw} kW`, color: "bg-blue-50 text-blue-600" },
            { icon: Zap, label: "AC Charge", value: `${car.chargeAcKw} kW`, color: "bg-purple-50 text-purple-600" },
            { icon: Clock, label: "10-80% (DC)", value: `${car.charge10to80Min} นาที`, color: "bg-orange-50 text-orange-600" },
            { icon: Battery, label: "ขนาดแบต", value: `${car.batteryKwh} kWh`, color: "bg-green-50 text-green-600" },
            { icon: Clock, label: "ชาร์จเต็ม (AC)", value: `${car.chargeFullHr} ชม.`, color: "bg-orange-50 text-orange-600" },
            { icon: Users, label: "ที่นั่ง", value: `${car.seats} ที่นั่ง`, color: "bg-gray-50 text-gray-600" },
            { icon: Zap, label: "หัวชาร์จ", value: car.connectors.join(", "), color: "bg-blue-50 text-blue-600" },
          ].map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${s.color}`}>
                <s.icon size={16} />
              </div>
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-sm font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Cost estimate */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10">
          <h3 className="font-black text-gray-900 mb-4">ต้นทุนค่าชาร์จโดยประมาณ</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-green-600">{(car.batteryKwh * 7).toFixed(0)}</p>
              <p className="text-xs text-gray-500">บาท/ชาร์จเต็ม (7 ฿/kWh)</p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-600">{((car.batteryKwh * 7) / car.rangeKm).toFixed(1)}</p>
              <p className="text-xs text-gray-500">บาท/กม.</p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-600">{((car.batteryKwh * 7) / car.rangeKm * 1500).toFixed(0)}</p>
              <p className="text-xs text-gray-500">บาท/เดือน (1,500 กม.)</p>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">รถ{SEGMENTS[car.segment]}รุ่นอื่นที่น่าสนใจ</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {similar.map(s => (
                <Link key={s.id} href={`/cars/${s.id}`}
                  className="border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-md transition-all group">
                  <p className="text-xs text-green-600 font-bold">{s.brand}</p>
                  <p className="font-black text-gray-900 mb-2">{s.model}</p>
                  <p className="text-sm text-gray-500 mb-3">{formatPrice(s.priceMin)} · {s.rangeKm} กม.</p>
                  <span className="text-xs text-green-600 font-semibold group-hover:underline flex items-center gap-1">
                    ดูสเปค <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
