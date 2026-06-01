import { NextRequest, NextResponse } from "next/server";

const OVERPASS = "https://overpass-api.de/api/interpreter";

// Thailand bounding box: south, west, north, east
const TH_BBOX = "5.5,97.3,20.5,105.7";

const PROVINCE_COORDS: Record<string, [number, number]> = {
  "กรุงเทพมหานคร": [13.7563, 100.5018],
  "เชียงใหม่": [18.7883, 98.9853],
  "ภูเก็ต": [7.8804, 98.3923],
  "ชลบุรี": [13.3611, 100.9847],
  "ขอนแก่น": [16.4322, 102.8236],
  "นครราชสีมา": [14.9798, 102.0978],
  "เชียงราย": [19.9105, 99.8406],
  "อุดรธานี": [17.4138, 102.7872],
  "สุราษฎร์ธานี": [9.1382, 99.3211],
  "นครศรีธรรมราช": [8.4304, 99.9631],
  "หาดใหญ่": [7.0062, 100.4747],
  "ระยอง": [12.6814, 101.2816],
  "นนทบุรี": [13.8622, 100.5134],
  "ปทุมธานี": [14.0208, 100.5259],
  "สมุทรปราการ": [13.5990, 100.5998],
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
      next: { revalidate: 600 },
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

    const stations = elements
      .filter((el) => (el.lat ?? el.center?.lat) && (el.lon ?? el.center?.lon))
      .map(osmToStation);

    return NextResponse.json(stations);
  } catch (err) {
    console.error("Overpass error:", err);
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}
