import { NextRequest, NextResponse } from "next/server";

const OSRM = "https://router.project-osrm.org/route/v1/driving";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const NEARBY_KM = 15;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointToSegment(plat: number, plon: number, alat: number, alon: number, blat: number, blon: number) {
  const dlat = blat - alat, dlon = blon - alon;
  if (Math.abs(dlat) < 1e-10 && Math.abs(dlon) < 1e-10) return { distKm: haversineKm(plat, plon, alat, alon), t: 0 };
  const t = Math.max(0, Math.min(1, ((plat - alat) * dlat + (plon - alon) * dlon) / (dlat ** 2 + dlon ** 2)));
  return { distKm: haversineKm(plat, plon, alat + t * dlat, alon + t * dlon), t };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const oLat = parseFloat(searchParams.get("oLat") ?? "");
  const oLon = parseFloat(searchParams.get("oLon") ?? "");
  const dLat = parseFloat(searchParams.get("dLat") ?? "");
  const dLon = parseFloat(searchParams.get("dLon") ?? "");
  const carRange = parseFloat(searchParams.get("range") ?? "400");

  if ([oLat, oLon, dLat, dLon].some(isNaN)) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  // 1. Get route from OSRM
  let routeCoords: [number, number][] = [[oLon, oLat], [dLon, dLat]];
  let totalDistKm = haversineKm(oLat, oLon, dLat, dLon);
  let usedFallback = false;

  try {
    const url = `${OSRM}/${oLon},${oLat};${dLon},${dLat}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      const r = data.routes?.[0];
      if (r?.geometry?.coordinates?.length >= 2) {
        routeCoords = r.geometry.coordinates;
        totalDistKm = r.distance / 1000;
      } else usedFallback = true;
    } else usedFallback = true;
  } catch {
    usedFallback = true;
  }

  // 2. Cumulative distance along route
  const cumDist: number[] = [0];
  for (let i = 1; i < routeCoords.length; i++) {
    const [aLon, aLat] = routeCoords[i - 1];
    const [bLon, bLat] = routeCoords[i];
    cumDist.push(cumDist[i - 1] + haversineKm(aLat, aLon, bLat, bLon));
  }

  // 3. Fetch stations in route bbox
  const lats = routeCoords.map(c => c[1]);
  const lons = routeCoords.map(c => c[0]);
  const buf = 0.3;
  const bbox = `${Math.min(...lats) - buf},${Math.min(...lons) - buf},${Math.max(...lats) + buf},${Math.max(...lons) + buf}`;

  let elements: { id: number; lat: number; lon: number; tags?: Record<string, string> }[] = [];
  try {
    const query = `[out:json][timeout:25];node["amenity"="charging_station"](${bbox});out body;`;
    const res = await fetch(OVERPASS, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "EVChargeMapThailand/1.0" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(20000),
      next: { revalidate: 600 },
    });
    if (res.ok) elements = (await res.json()).elements ?? [];
  } catch { /* ignore */ }

  // 4. Filter stations near route & compute position
  const routeStations = elements
    .map((el) => {
      if (!el.lat || !el.lon) return null;
      const tags = el.tags ?? {};
      let minDist = Infinity, posAlong = 0;

      for (let i = 0; i < routeCoords.length - 1; i++) {
        const [aLon, aLat] = routeCoords[i];
        const [bLon, bLat] = routeCoords[i + 1];
        const { distKm, t } = pointToSegment(el.lat, el.lon, aLat, aLon, bLat, bLon);
        if (distKm < minDist) {
          minDist = distKm;
          posAlong = cumDist[i] + t * (cumDist[i + 1] - cumDist[i]);
        }
      }

      if (minDist > NEARBY_KM) return null;

      // Build connector summary
      const socketKeys = ["socket:type2","socket:ccs2","socket:chademo","socket:type1","socket:gb_t_dc"];
      const connectors = socketKeys
        .filter(k => tags[k] && tags[k] !== "0" && tags[k] !== "no")
        .map(k => {
          const names: Record<string, string> = { "socket:type2": "Type 2", "socket:ccs2": "CCS2", "socket:chademo": "CHAdeMO", "socket:type1": "Type 1", "socket:gb_t_dc": "GB/T" };
          const output = tags[`${k}:output`] ?? "";
          const kw = parseFloat(output.replace(/[^0-9.]/g, "")) || undefined;
          return `${names[k]}${kw ? ` ${kw}kW` : ""}`;
        });

      return {
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: tags.name || tags.operator || tags.brand || "EV Charging Station",
        operator: tags.operator,
        distToRoute: Math.round(minDist * 10) / 10,
        posAlong: Math.round(posAlong * 10) / 10,
        openingHours: tags.opening_hours,
        fee: tags.fee === "no" ? "ฟรี" : tags.charge ? `${tags.charge}` : tags.fee === "yes" ? "มีค่าบริการ" : undefined,
        connectors: connectors.length > 0 ? connectors : undefined,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && x !== undefined)
    .sort((a, b) => a.posAlong - b.posAlong);

  // 5. Add reachability: can reach from previous stop?
  let prevPos = 0;
  const withReach = routeStations.map((s) => {
    const distFromPrev = Math.round((s.posAlong - prevPos) * 10) / 10;
    const reachable = distFromPrev <= carRange;
    prevPos = s.posAlong;
    return { ...s, distFromPrev, reachable };
  });

  const lastPos = routeStations[routeStations.length - 1]?.posAlong ?? 0;
  const distLastToDest = Math.round((totalDistKm - lastPos) * 10) / 10;

  return NextResponse.json({
    route: routeCoords,
    totalDistKm: Math.round(totalDistKm),
    stations: withReach,
    distLastToDest,
    destReachable: distLastToDest <= carRange,
    usedFallback,
  });
}
