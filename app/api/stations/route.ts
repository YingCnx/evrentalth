import { NextRequest, NextResponse } from "next/server";

const OCMAP_API = "https://api.openchargemap.io/v3/poi";
const API_KEY = process.env.OCMAP_API_KEY ?? "";

// Mock data — used when no API key is configured
const MOCK_STATIONS = [
  {
    ID: 1001,
    AddressInfo: { Title: "EA Anywhere — CentralWorld", AddressLine1: "999/9 ถ.พระรามที่ 1", Town: "ปทุมวัน", StateOrProvince: "กรุงเทพมหานคร", Latitude: 13.7466, Longitude: 100.5394, ContactTelephone1: "02-101-1234" },
    Connections: [{ ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 50, Quantity: 2 }, { ConnectionType: { Title: "CHAdeMO" }, PowerKW: 50, Quantity: 2 }],
    OperatorInfo: { Title: "EA Anywhere", WebsiteURL: "https://www.eaanywhere.com" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿6.50/kWh",
  },
  {
    ID: 1002,
    AddressInfo: { Title: "PEA Volta — สยามพารากอน", AddressLine1: "991 ถ.พระรามที่ 1", Town: "ปทุมวัน", StateOrProvince: "กรุงเทพมหานคร", Latitude: 13.7459, Longitude: 100.5347 },
    Connections: [{ ConnectionType: { Title: "Type 2 (AC)" }, PowerKW: 22, Quantity: 4 }],
    OperatorInfo: { Title: "PEA Volta" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿5.00/kWh",
  },
  {
    ID: 1003,
    AddressInfo: { Title: "EVOLT — เซ็นทรัลพลาซา แจ้งวัฒนะ", AddressLine1: "99/9 ถ.แจ้งวัฒนะ", Town: "ปากเกร็ด", StateOrProvince: "นนทบุรี", Latitude: 13.8960, Longitude: 100.5344 },
    Connections: [{ ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 120, Quantity: 2 }, { ConnectionType: { Title: "Type 2 (AC)" }, PowerKW: 22, Quantity: 4 }],
    OperatorInfo: { Title: "EVOLT" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿7.00/kWh",
  },
  {
    ID: 1004,
    AddressInfo: { Title: "OR EV Station — PTT สาขาเชียงใหม่", AddressLine1: "123 ถ.นิมมานเหมินท์", Town: "สุเทพ", StateOrProvince: "เชียงใหม่", Latitude: 18.7993, Longitude: 98.9680 },
    Connections: [{ ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 60, Quantity: 2 }, { ConnectionType: { Title: "CHAdeMO" }, PowerKW: 60, Quantity: 1 }],
    OperatorInfo: { Title: "OR (PTT Oil Retail)" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿6.00/kWh",
  },
  {
    ID: 1005,
    AddressInfo: { Title: "EA Anywhere — Central Festival Phuket", AddressLine1: "74-75 ถ.เจ้าฟ้า", Town: "กะทู้", StateOrProvince: "ภูเก็ต", Latitude: 7.9061, Longitude: 98.3595 },
    Connections: [{ ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 50, Quantity: 2 }, { ConnectionType: { Title: "Type 2 (AC)" }, PowerKW: 22, Quantity: 2 }],
    OperatorInfo: { Title: "EA Anywhere", WebsiteURL: "https://www.eaanywhere.com" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿6.50/kWh",
  },
  {
    ID: 1006,
    AddressInfo: { Title: "Sharge — Pattaya Avenue", AddressLine1: "คืนสุข 13", Town: "พัทยาเหนือ", StateOrProvince: "ชลบุรี", Latitude: 12.9377, Longitude: 100.8820 },
    Connections: [{ ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 180, Quantity: 4 }],
    OperatorInfo: { Title: "Sharge" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿7.50/kWh",
  },
  {
    ID: 1007,
    AddressInfo: { Title: "EA Anywhere — Central Plaza Khon Kaen", AddressLine1: "99/9 ถ.ศรีจันทร์", Town: "เมืองขอนแก่น", StateOrProvince: "ขอนแก่น", Latitude: 16.4322, Longitude: 102.8236 },
    Connections: [{ ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 50, Quantity: 2 }],
    OperatorInfo: { Title: "EA Anywhere" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿6.50/kWh",
  },
  {
    ID: 1008,
    AddressInfo: { Title: "EVOLT — Terminal 21 Korat", AddressLine1: "2/2 ถ.มิตรภาพ", Town: "เมืองนครราชสีมา", StateOrProvince: "นครราชสีมา", Latitude: 14.9741, Longitude: 102.1019 },
    Connections: [{ ConnectionType: { Title: "Type 2 (AC)" }, PowerKW: 22, Quantity: 4 }, { ConnectionType: { Title: "CCS (Type 2)" }, PowerKW: 60, Quantity: 2 }],
    OperatorInfo: { Title: "EVOLT" },
    StatusType: { Title: "Operational", IsOperational: true },
    UsageCost: "฿6.00/kWh",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // No API key → return mock data
  if (!API_KEY) {
    return NextResponse.json(MOCK_STATIONS);
  }

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
