import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Zap, ChevronRight, ArrowLeft } from "lucide-react";
import PageLayout from "../../../components/PageLayout";

const PROVINCE_SLUGS: Record<string, string> = {
  "bangkok": "กรุงเทพมหานคร",
  "chiang-mai": "เชียงใหม่",
  "chon-buri": "ชลบุรี",
  "phuket": "ภูเก็ต",
  "khon-kaen": "ขอนแก่น",
  "nakhon-ratchasima": "นครราชสีมา",
  "chiang-rai": "เชียงราย",
  "udon-thani": "อุดรธานี",
  "rayong": "ระยอง",
  "samut-prakan": "สมุทรปราการ",
};

// Province coords for Overpass bbox (center ± offset)
const PROVINCE_BBOX: Record<string, [number, number, number, number]> = {
  "กรุงเทพมหานคร": [13.50, 100.32, 13.95, 100.75],
  "เชียงใหม่": [18.20, 98.60, 19.20, 99.50],
  "ชลบุรี": [13.00, 100.80, 13.80, 101.50],
  "ภูเก็ต": [7.75, 98.27, 8.20, 98.45],
  "ขอนแก่น": [16.00, 102.50, 16.90, 103.20],
  "นครราชสีมา": [14.50, 101.70, 15.50, 102.60],
  "เชียงราย": [19.50, 99.60, 20.30, 100.20],
  "อุดรธานี": [17.10, 102.50, 17.80, 103.20],
  "ระยอง": [12.45, 101.10, 13.00, 101.80],
  "สมุทรปราการ": [13.45, 100.55, 13.75, 100.80],
};

type OsmElement = {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function fetchProvinceStations(provinceTh: string): Promise<OsmElement[]> {
  const bbox = PROVINCE_BBOX[provinceTh];
  if (!bbox) return [];
  const [s, w, n, e] = bbox;
  const query = `[out:json][timeout:25];
(
  node["amenity"="charging_station"](${s},${w},${n},${e});
  way["amenity"="charging_station"](${s},${w},${n},${e});
);
out body center;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.elements ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return Object.keys(PROVINCE_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provinceTh = PROVINCE_SLUGS[slug];
  if (!provinceTh) return {};
  return {
    title: `จุดชาร์จ EV ${provinceTh} – แผนที่สถานีชาร์จรถไฟฟ้า`,
    description: `รวมจุดชาร์จรถไฟฟ้า EV ใน${provinceTh} ทุกเครือข่าย EA Anywhere, PTT EV, Sharge ดูตำแหน่งบนแผนที่ ประเภทหัวชาร์จ AC DC Fast Charge`,
    keywords: [`จุดชาร์จ EV ${provinceTh}`, `ชาร์จรถไฟฟ้า${provinceTh}`, `EV charging ${slug}`, `สถานีชาร์จ${provinceTh}`],
  };
}

function connectorLabel(tags: Record<string, string>): string {
  const sockets = Object.entries(tags)
    .filter(([k]) => k.startsWith("socket:") && tags[k] !== "no")
    .map(([k]) => k.replace("socket:", "").toUpperCase());
  if (sockets.length > 0) return sockets.slice(0, 2).join(", ");
  const cap = tags["capacity:charging"];
  return cap ? `${cap} หัว` : "EV Charger";
}

export default async function ProvinceChargersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provinceTh = PROVINCE_SLUGS[slug];

  if (!provinceTh) {
    return (
      <PageLayout>
        <div className="max-w-6xl mx-auto px-5 py-20 text-center">
          <p className="text-gray-500">ไม่พบข้อมูลจังหวัดนี้</p>
          <Link href="/chargers" className="mt-4 inline-flex items-center gap-1 text-cyan-600 font-semibold text-sm hover:underline">
            <ArrowLeft size={14} /> กลับหน้าเครือข่ายชาร์จ
          </Link>
        </div>
      </PageLayout>
    );
  }

  const elements = await fetchProvinceStations(provinceTh);
  const stations = elements.filter((el) => {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    return lat && lon;
  });

  const mapUrl = `/map?province=${encodeURIComponent(provinceTh)}`;

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `มีจุดชาร์จ EV กี่แห่งใน${provinceTh}?`,
        acceptedAnswer: { "@type": "Answer", text: `ใน${provinceTh}มีจุดชาร์จรถไฟฟ้า EV ที่ลงทะเบียนใน OpenStreetMap ทั้งหมด ${stations.length} สถานี ครอบคลุมทั้ง AC Charger, DC Fast Charge และ Super Charger` },
      },
      {
        "@type": "Question",
        name: `เครือข่ายชาร์จ EV ใดให้บริการใน${provinceTh}?`,
        acceptedAnswer: { "@type": "Answer", text: `เครือข่ายหลักที่ให้บริการใน${provinceTh}ได้แก่ EA Anywhere, PTT EV Station, Sharge, MG Charging และ BYD Auto โดยสามารถดูตำแหน่งแบบ real-time ได้บนแผนที่` },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: "https://evrentalth.com" },
      { "@type": "ListItem", position: 2, name: "เครือข่ายชาร์จ", item: "https://evrentalth.com/chargers" },
      { "@type": "ListItem", position: 3, name: `จุดชาร์จ${provinceTh}`, item: `https://evrentalth.com/chargers/province/${slug}` },
    ],
  };

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link href="/chargers" className="hover:text-gray-600 transition-colors">เครือข่ายชาร์จ</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600">{provinceTh}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                จุดชาร์จ EV <span className="text-cyan-600">{provinceTh}</span>
              </h1>
              <p className="text-gray-500">
                {stations.length > 0
                  ? `พบ ${stations.length} สถานีชาร์จจาก OpenStreetMap`
                  : "ข้อมูลจาก OpenStreetMap"}
              </p>
            </div>
            <Link
              href={mapUrl}
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <MapPin size={15} />ดูบนแผนที่
            </Link>
          </div>
        </div>
      </section>

      {/* Station list */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        {stations.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Zap size={32} strokeWidth={1.5} className="mx-auto mb-3" />
            <p className="font-medium">ไม่พบข้อมูลสถานีชาร์จ</p>
            <p className="text-sm mt-1">ลองดูบนแผนที่แบบ real-time</p>
            <Link href={mapUrl} className="mt-4 inline-flex items-center gap-1.5 text-cyan-600 font-semibold text-sm hover:underline">
              <MapPin size={13} />เปิดแผนที่
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.slice(0, 30).map((el) => {
              const lat = el.lat ?? el.center?.lat ?? 0;
              const lon = el.lon ?? el.center?.lon ?? 0;
              const tags = el.tags ?? {};
              const name = tags.name ?? tags.operator ?? tags.brand ?? "EV Charging Station";
              const operator = tags.operator ?? tags.brand;
              const connectors = connectorLabel(tags);
              const isFast = /ccs|dc|chademo/i.test(Object.keys(tags).filter(k => k.startsWith("socket:") && tags[k] !== "no").join(","));
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

              return (
                <div key={el.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-cyan-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                      <Zap size={16} className="text-cyan-600" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isFast ? "bg-orange-50 text-orange-600" : "bg-cyan-50 text-cyan-600"
                    }`}>
                      {isFast ? "DC Fast" : "AC Charge"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">{name}</p>
                  {operator && operator !== name && (
                    <p className="text-xs text-gray-400 mb-2">{operator}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-3">{connectors}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-600 font-semibold hover:underline"
                  >
                    <MapPin size={11} />นำทาง
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {stations.length > 30 && (
          <p className="text-center text-sm text-gray-400 mt-6">
            แสดง 30 จาก {stations.length} สถานี —{" "}
            <Link href={mapUrl} className="text-cyan-600 font-semibold hover:underline">ดูทั้งหมดบนแผนที่</Link>
          </p>
        )}
      </section>

      {/* Other provinces */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-lg font-bold text-gray-900 mb-5">จังหวัดอื่น</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PROVINCE_SLUGS)
              .filter(([s]) => s !== slug)
              .map(([s, th]) => (
                <Link
                  key={s}
                  href={`/chargers/province/${s}`}
                  className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-xl hover:border-cyan-300 hover:text-cyan-700 transition-colors"
                >
                  {th}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
