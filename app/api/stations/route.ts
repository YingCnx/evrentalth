import { NextRequest, NextResponse } from "next/server";

const OCMAP_API = "https://api.openchargemap.io/v3/poi";
const API_KEY = process.env.OCMAP_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = new URLSearchParams({
    output: "json",
    countrycode: "TH",
    maxresults: searchParams.get("maxresults") ?? "100",
    compact: "true",
    verbose: "false",
    key: API_KEY,
  });

  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const distance = searchParams.get("distance");
  const connectiontypeid = searchParams.get("connectiontypeid");
  const levelid = searchParams.get("levelid");

  if (latitude) params.set("latitude", latitude);
  if (longitude) params.set("longitude", longitude);
  if (distance) params.set("distance", distance);
  if (connectiontypeid) params.set("connectiontypeid", connectiontypeid);
  if (levelid) params.set("levelid", levelid);

  try {
    const res = await fetch(`${OCMAP_API}?${params}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`OCMAP error: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}
