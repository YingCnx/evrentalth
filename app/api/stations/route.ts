import { NextRequest, NextResponse } from "next/server";
import { CHARGER_NETWORKS } from "../../lib/chargers";

const OVERPASS = "https://overpass-api.de/api/interpreter";

// Thailand bounding box: south, west, north, east
const TH_BBOX = "5.5,97.3,20.5,105.7";

const PROVINCE_COORDS: Record<string, [number, number]> = {
  // ภาคกลาง
  "กรุงเทพมหานคร": [13.7563, 100.5018],
  "นนทบุรี": [13.8622, 100.5134],
  "ปทุมธานี": [14.0208, 100.5259],
  "สมุทรปราการ": [13.5990, 100.5998],
  "สมุทรสาคร": [13.5475, 100.2747],
  "สมุทรสงคราม": [13.4098, 100.0023],
  "นครปฐม": [13.8199, 100.0624],
  "สุพรรณบุรี": [14.4744, 100.1177],
  "กาญจนบุรี": [14.0023, 99.5328],
  "ราชบุรี": [13.5282, 99.8134],
  "เพชรบุรี": [13.1120, 99.9398],
  "ประจวบคีรีขันธ์": [11.8126, 99.7957],
  "อ่างทอง": [14.5896, 100.4550],
  "พระนครศรีอยุธยา": [14.3692, 100.5877],
  "ลพบุรี": [14.7995, 100.6534],
  "สระบุรี": [14.5289, 100.9102],
  "ชัยนาท": [15.1851, 100.1252],
  "สิงห์บุรี": [14.8936, 100.3975],
  "นครนายก": [14.2069, 101.2130],
  "ปราจีนบุรี": [14.0519, 101.3660],
  "สระแก้ว": [13.8246, 102.0643],
  "ฉะเชิงเทรา": [13.6902, 101.0779],
  "ชลบุรี": [13.3611, 100.9847],
  "ระยอง": [12.6814, 101.2816],
  "จันทบุรี": [12.6113, 102.1040],
  "ตราด": [12.2428, 102.5175],
  // ภาคเหนือ
  "เชียงใหม่": [18.7883, 98.9853],
  "เชียงราย": [19.9105, 99.8406],
  "ลำปาง": [18.2888, 99.4927],
  "ลำพูน": [18.5745, 99.0087],
  "แม่ฮ่องสอน": [19.3020, 97.9654],
  "พะเยา": [19.1665, 99.9010],
  "น่าน": [18.7756, 100.7730],
  "แพร่": [18.1445, 100.1403],
  "อุตรดิตถ์": [17.6200, 100.0993],
  "ตาก": [16.8840, 99.1258],
  "สุโขทัย": [17.0070, 99.8265],
  "พิษณุโลก": [16.8211, 100.2659],
  "พิจิตร": [16.4416, 100.3487],
  "กำแพงเพชร": [16.4827, 99.5226],
  "นครสวรรค์": [15.7030, 100.1370],
  "อุทัยธานี": [15.3835, 100.0255],
  // ภาคตะวันออกเฉียงเหนือ
  "ขอนแก่น": [16.4322, 102.8236],
  "อุดรธานี": [17.4138, 102.7872],
  "นครราชสีมา": [14.9798, 102.0978],
  "บึงกาฬ": [18.3609, 103.6465],
  "หนองคาย": [17.8782, 102.7416],
  "หนองบัวลำภู": [17.2218, 102.4260],
  "เลย": [17.4861, 101.7223],
  "สกลนคร": [17.1554, 104.1348],
  "นครพนม": [17.3922, 104.7693],
  "มุกดาหาร": [16.5424, 104.7241],
  "กาฬสินธุ์": [16.4314, 103.5058],
  "มหาสารคาม": [16.1851, 103.3008],
  "ร้อยเอ็ด": [16.0538, 103.6520],
  "ยโสธร": [15.7924, 104.1452],
  "อำนาจเจริญ": [15.8656, 104.6257],
  "อุบลราชธานี": [15.2287, 104.8563],
  "ศรีสะเกษ": [15.1199, 104.3220],
  "สุรินทร์": [14.8820, 103.4937],
  "บุรีรัมย์": [14.9930, 103.1029],
  "ชัยภูมิ": [15.8068, 102.0318],
  // ภาคใต้
  "สุราษฎร์ธานี": [9.1382, 99.3211],
  "นครศรีธรรมราช": [8.4304, 99.9631],
  "ภูเก็ต": [7.8804, 98.3923],
  "กระบี่": [8.0863, 98.9063],
  "พังงา": [8.4509, 98.5255],
  "ระนอง": [9.9528, 98.6084],
  "ชุมพร": [10.4930, 99.1800],
  "สงขลา": [7.1756, 100.6142],
  "สตูล": [6.6238, 100.0674],
  "ตรัง": [7.5593, 99.6114],
  "พัทลุง": [7.6167, 100.0742],
  "ปัตตานี": [6.8695, 101.2500],
  "ยะลา": [6.5415, 101.2803],
  "นราธิวาส": [6.4254, 101.8253],
};

type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const SOCKET_MAP: Record<string, string> = {
  "socket:type2": "Type 2 (AC)",
  "socket:type1": "Type 1 (AC)",
  "socket:ccs2": "CCS2 (DC)",
  "socket:type2_combo": "CCS2 (DC)",
  "socket:chademo": "CHAdeMO (DC)",
  "socket:tesla_supercharger": "Tesla Supercharger",
  "socket:tesla_destination": "Tesla Destination",
  "socket:type3c": "Type 3C",
  "socket:gb_t_dc": "GB/T (DC)",
  "socket:gb_t_ac": "GB/T (AC)",
};

function osmToStation(el: OsmElement) {
  const tags = el.tags ?? {};
  const lat = el.lat ?? el.center?.lat ?? 0;
  const lon = el.lon ?? el.center?.lon ?? 0;

  // Build connections from socket tags
  const connections: {
    ConnectionType: { Title: string };
    PowerKW?: number;
    Quantity?: number;
  }[] = [];

  for (const [key, label] of Object.entries(SOCKET_MAP)) {
    const val = tags[key];
    if (!val || val === "0" || val === "no") continue;
    const qty = parseInt(val) || 1;
    const outputRaw = tags[`${key}:output`] ?? tags["charging_station:output"] ?? "";
    const powerKw = outputRaw ? parseFloat(outputRaw.replace(/[^0-9.]/g, "")) || undefined : undefined;
    connections.push({ ConnectionType: { Title: label }, PowerKW: powerKw, Quantity: qty });
  }

  // Fallback: generic charger if no socket tags
  if (connections.length === 0) {
    const capacity = parseInt(tags.capacity ?? "0") || 1;
    const output = tags["charging_station:output"] ?? "";
    const kw = output ? parseFloat(output.replace(/[^0-9.]/g, "")) || undefined : undefined;
    connections.push({ ConnectionType: { Title: "EV Charger" }, PowerKW: kw, Quantity: capacity });
  }

  // Friendly name
  const title =
    tags.name ||
    tags["name:en"] ||
    tags.operator ||
    tags.brand ||
    "EV Charging Station";

  const address = [
    tags["addr:housenumber"],
    tags["addr:street"] ?? tags["addr:full"],
  ].filter(Boolean).join(" ") || undefined;

  const town = tags["addr:city"] ?? tags["addr:district"] ?? tags["addr:subdistrict"] ?? undefined;
  const province = tags["addr:province"] ?? tags["addr:state"] ?? undefined;

  const fee = tags.fee === "no" ? "ฟรี / Free" : tags.charge ? `฿${tags.charge}` : tags.fee === "yes" ? "มีค่าบริการ" : undefined;

  return {
    ID: el.id,
    AddressInfo: {
      Title: title,
      AddressLine1: address,
      Town: town,
      StateOrProvince: province,
      Latitude: lat,
      Longitude: lon,
      ContactTelephone1: tags.phone ?? tags["contact:phone"] ?? undefined,
    },
    Connections: connections,
    OperatorInfo: tags.operator ? { Title: tags.operator, WebsiteURL: tags.website ?? tags["contact:website"] ?? undefined } : undefined,
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: fee,
    AccessComments: tags.opening_hours ?? undefined,
    // Extra OSM tags for display
    _osm: {
      access: tags.access,
      network: tags.network,
    },
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const province = searchParams.get("province") ?? "";
  const chargerType = searchParams.get("chargerType") ?? "";
  const operatorId = searchParams.get("operator") ?? "";

  // Build bbox or around query
  let areaQuery: string;
  if (province && PROVINCE_COORDS[province]) {
    const [lat, lon] = PROVINCE_COORDS[province];
    areaQuery = `(around:80000,${lat},${lon})`;
  } else {
    areaQuery = `(${TH_BBOX})`;
  }

  // Charger type filter
  let socketFilter = "";
  if (chargerType === "ac") socketFilter = '["socket:type2"]["socket:type2"!="0"]';
  else if (chargerType === "dc") socketFilter = '["socket:chademo"]|["socket:ccs2"]|["socket:type2_combo"]';
  else if (chargerType === "fast") socketFilter = '["charging_station:output"~"[5-9][0-9]+|[1-9][0-9]{2,}"]';

  const query = `
[out:json][timeout:30];
(
  node["amenity"="charging_station"]${areaQuery};
  way["amenity"="charging_station"]${areaQuery};
);
out center body;
  `.trim();

  try {
    const res = await fetch(OVERPASS, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "EVChargeMapThailand/1.0 (educational project)",
        "Accept": "application/json",
      },
      body: `data=${encodeURIComponent(query)}`,
      // province queries: 10 min, full-Thailand: 1 hour
      next: { revalidate: province ? 600 : 3600 },
    });

    if (!res.ok) throw new Error(`Overpass error: ${res.status}`);

    const json = await res.json();
    let elements: OsmElement[] = json.elements ?? [];

    // Client-side charger type filter (more reliable than Overpass regex)
    if (chargerType === "ac") {
      elements = elements.filter((el) =>
        Object.keys(el.tags ?? {}).some((k) => ["socket:type2", "socket:type1"].includes(k) && (el.tags?.[k] ?? "0") !== "0")
      );
    } else if (chargerType === "dc") {
      elements = elements.filter((el) =>
        Object.keys(el.tags ?? {}).some((k) => ["socket:chademo", "socket:ccs2", "socket:type2_combo"].includes(k) && (el.tags?.[k] ?? "0") !== "0")
      );
    } else if (chargerType === "fast") {
      elements = elements.filter((el) => {
        const output = el.tags?.["charging_station:output"] ?? "";
        const kw = parseFloat(output.replace(/[^0-9.]/g, ""));
        if (kw >= 50) return true;
        // Also check individual socket outputs
        return Object.keys(el.tags ?? {}).some((k) => {
          if (!k.includes(":output")) return false;
          const v = parseFloat((el.tags?.[k] ?? "").replace(/[^0-9.]/g, ""));
          return v >= 50;
        });
      });
    }

    // Operator filter — match against OSM operator/brand/name tags
    if (operatorId) {
      const network = CHARGER_NETWORKS.find(n => n.id === operatorId);
      if (network) {
        const keywords = network.osmKeywords.map(k => k.toLowerCase());
        elements = elements.filter((el) => {
          const tags = el.tags ?? {};
          const fields = [tags.operator, tags.brand, tags.network, tags.name].filter(Boolean);
          return fields.some(f => keywords.some(kw => f!.toLowerCase().includes(kw)));
        });
      }
    }

    const stations = elements
      .filter((el) => (el.lat ?? el.center?.lat) && (el.lon ?? el.center?.lon))
      .map(osmToStation);

    return NextResponse.json(stations, {
      headers: {
        "Cache-Control": province
          ? "public, s-maxage=600, stale-while-revalidate=300"
          : "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    console.error("Overpass error:", err);
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}
