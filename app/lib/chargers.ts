// นัท สิริมงคล — Data Engineer: ข้อมูลเครือข่ายชาร์จ

export type ChargerNetwork = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  stations: number;
  provinces: number;
  dcKw: number[];
  acKw: number[];
  pricePerKwh: number | null;
  pricePerMin: number | null;
  priceNote: string;
  app: string;
  connectors: string[];
  highlights: string[];
  website: string;
  /** คำ keyword ที่ใช้ match กับ operator tag ใน OSM */
  osmKeywords: string[];
};

export const CHARGER_NETWORKS: ChargerNetwork[] = [
  {
    id: "ea-anywhere",
    name: "EA Anywhere", shortName: "EA",
    color: "#00A651",
    stations: 1000, provinces: 77,
    dcKw: [50, 120, 180], acKw: [7, 22],
    pricePerKwh: 6.5, pricePerMin: null,
    priceNote: "6.50 บาท/kWh (DC), 4.00 บาท/kWh (AC)",
    app: "EA Anywhere",
    connectors: ["CCS2", "CHAdeMO", "Type 2"],
    highlights: ["เครือข่ายใหญ่ที่สุดในไทย", "ครอบคลุม 77 จังหวัด", "มีในปั๊มน้ำมัน"],
    website: "https://www.eaanywhere.com",
    osmKeywords: ["ea anywhere", "energy absolute", "ea"],
  },
  {
    id: "ptt-ev",
    name: "PTT EV Station", shortName: "PTT",
    color: "#003087",
    stations: 400, provinces: 60,
    dcKw: [50, 100], acKw: [7],
    pricePerKwh: 7.0, pricePerMin: null,
    priceNote: "7.00 บาท/kWh",
    app: "PTT EV Station",
    connectors: ["CCS2", "CHAdeMO", "Type 2"],
    highlights: ["ในปั๊ม PTT ทั่วประเทศ", "สะดวก ปลอดภัย", "มีร้านสะดวกซื้อในปั๊ม"],
    website: "https://www.pttor.com",
    osmKeywords: ["ptt", "ptt ev"],
  },
  {
    id: "sharge",
    name: "Sharge", shortName: "SHG",
    color: "#7C3AED",
    stations: 150, provinces: 30,
    dcKw: [120, 180, 240], acKw: [11, 22],
    pricePerKwh: 8.5, pricePerMin: null,
    priceNote: "8.50 บาท/kWh (DC Fast)",
    app: "Sharge",
    connectors: ["CCS2", "Type 2"],
    highlights: ["DC เร็วสุด 240kW", "สถานีใหม่ทันสมัย", "นิยมในกรุงเทพ"],
    website: "https://www.sharge.co.th",
    osmKeywords: ["sharge"],
  },
  {
    id: "mg-charging",
    name: "MG Charging", shortName: "MG",
    color: "#DC2626",
    stations: 80, provinces: 30,
    dcKw: [50], acKw: [7],
    pricePerKwh: null, pricePerMin: 3.5,
    priceNote: "3.50 บาท/นาที",
    app: "MG iSMART",
    connectors: ["CCS2", "Type 2"],
    highlights: ["ฟรีสำหรับเจ้าของ MG", "ในโชว์รูม MG ทั่วไทย"],
    website: "https://www.mgcars.com/th",
    osmKeywords: ["mg charging", "saic-mg", "mg"],
  },
  {
    id: "byd-charging",
    name: "BYD Charging", shortName: "BYD",
    color: "#1D4ED8",
    stations: 70, provinces: 25,
    dcKw: [120], acKw: [7],
    pricePerKwh: 6.0, pricePerMin: null,
    priceNote: "6.00 บาท/kWh",
    app: "BYD Thailand",
    connectors: ["CCS2", "Type 2"],
    highlights: ["ในโชว์รูม BYD ทั่วไทย", "DC 120kW"],
    website: "https://www.byd.com/th",
    osmKeywords: ["byd"],
  },
];

export const PRICING_TABLE = CHARGER_NETWORKS.map(n => ({
  id: n.id,
  name: n.name,
  color: n.color,
  dcPrice: n.pricePerKwh ?? (n.pricePerMin ? `${n.pricePerMin} ฿/นาที` : "-"),
  fastCharge: Math.max(...n.dcKw),
  connectors: n.connectors,
  app: n.app,
}));
