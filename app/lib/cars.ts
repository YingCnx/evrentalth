// นัท สิริมงคล — Data Engineer
// วันที่ 1: รวบรวมข้อมูลรถ EV ทุกรุ่นที่ขายในไทย

export type EVCar = {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceMin: number; // บาท
  priceMax: number;
  batteryKwh: number;
  rangeKm: number; // WLTP
  chargeDcKw: number; // DC fast charge max kW
  chargeAcKw: number; // AC max kW
  charge10to80Min: number; // นาที
  chargeFullHr: number; // ชั่วโมง (AC)
  connectors: string[];
  segment: "city" | "sedan" | "suv" | "mpv" | "pickup";
  seats: number;
  imageUrl?: string;
  grabFriendly: boolean;
  highlight: string; // จุดเด่น
};

export const EV_CARS: EVCar[] = [
  // BYD
  {
    id: "byd-dolphin-mini",
    brand: "BYD", model: "Dolphin Mini", year: 2024,
    priceMin: 549000, priceMax: 629000,
    batteryKwh: 38.88, rangeKm: 340,
    chargeDcKw: 60, chargeAcKw: 6.6,
    charge10to80Min: 30, chargeFullHr: 6,
    connectors: ["CCS2", "Type 2"],
    segment: "city", seats: 5,
    grabFriendly: true,
    highlight: "ราคาประหยัด เหมาะเมือง",
  },
  {
    id: "byd-dolphin",
    brand: "BYD", model: "Dolphin", year: 2024,
    priceMin: 699000, priceMax: 799000,
    batteryKwh: 60.48, rangeKm: 490,
    chargeDcKw: 60, chargeAcKw: 7,
    charge10to80Min: 40, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "city", seats: 5,
    grabFriendly: true,
    highlight: "ยอดขายอันดับ 1 ในไทย",
  },
  {
    id: "byd-atto3",
    brand: "BYD", model: "Atto 3", year: 2024,
    priceMin: 1099000, priceMax: 1199000,
    batteryKwh: 60.48, rangeKm: 480,
    chargeDcKw: 80, chargeAcKw: 7,
    charge10to80Min: 36, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    imageUrl: "/cars/byd-atto3.png",
    grabFriendly: false,
    highlight: "SUV ครอบครัว ราคาคุ้ม",
  },
  {
    id: "byd-seal",
    brand: "BYD", model: "Seal", year: 2024,
    priceMin: 1299000, priceMax: 1699000,
    batteryKwh: 82.56, rangeKm: 570,
    chargeDcKw: 150, chargeAcKw: 11,
    charge10to80Min: 26, chargeFullHr: 7,
    connectors: ["CCS2", "Type 2"],
    segment: "sedan", seats: 5,
    grabFriendly: false,
    highlight: "Sedan สปอร์ต ไฮเทค",
  },
  {
    id: "byd-sealion6",
    brand: "BYD", model: "Sealion 6", year: 2024,
    priceMin: 1299000, priceMax: 1499000,
    batteryKwh: 87.04, rangeKm: 580,
    chargeDcKw: 150, chargeAcKw: 11,
    charge10to80Min: 28, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    grabFriendly: false,
    highlight: "SUV รุ่นใหม่ ระยะไกล",
  },
  {
    id: "byd-han",
    brand: "BYD", model: "Han", year: 2024,
    priceMin: 1899000, priceMax: 1999000,
    batteryKwh: 85.44, rangeKm: 560,
    chargeDcKw: 120, chargeAcKw: 11,
    charge10to80Min: 35, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "sedan", seats: 5,
    grabFriendly: false,
    highlight: "Flagship Sedan หรูหรา",
  },

  // MG
  {
    id: "mg-zs-ev",
    brand: "MG", model: "ZS EV", year: 2024,
    priceMin: 899000, priceMax: 1099000,
    batteryKwh: 51, rangeKm: 440,
    chargeDcKw: 94, chargeAcKw: 7,
    charge10to80Min: 34, chargeFullHr: 6.5,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    grabFriendly: false,
    highlight: "SUV ราคาเข้าถึง",
  },
  {
    id: "mg4-electric",
    brand: "MG", model: "4 Electric", year: 2024,
    priceMin: 979000, priceMax: 1279000,
    batteryKwh: 64, rangeKm: 425,
    chargeDcKw: 135, chargeAcKw: 11,
    charge10to80Min: 26, chargeFullHr: 6,
    connectors: ["CCS2", "Type 2"],
    segment: "city", seats: 5,
    grabFriendly: true,
    highlight: "ชาร์จเร็ว ขับสนุก",
  },

  // Neta
  {
    id: "neta-v",
    brand: "Neta", model: "V", year: 2024,
    priceMin: 549000, priceMax: 649000,
    batteryKwh: 38.54, rangeKm: 380,
    chargeDcKw: 40, chargeAcKw: 6.6,
    charge10to80Min: 36, chargeFullHr: 7,
    connectors: ["CCS2", "Type 2"],
    segment: "city", seats: 5,
    grabFriendly: true,
    highlight: "ราคาถูกที่สุดในไทย",
  },
  {
    id: "neta-u-pro",
    brand: "Neta", model: "U Pro", year: 2024,
    priceMin: 849000, priceMax: 999000,
    batteryKwh: 70, rangeKm: 500,
    chargeDcKw: 100, chargeAcKw: 6.6,
    charge10to80Min: 35, chargeFullHr: 9,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    grabFriendly: false,
    highlight: "SUV ระยะไกล งบกลาง",
  },

  // Tesla
  {
    id: "tesla-model3",
    brand: "Tesla", model: "Model 3", year: 2024,
    priceMin: 1809000, priceMax: 2409000,
    batteryKwh: 75, rangeKm: 554,
    chargeDcKw: 170, chargeAcKw: 11,
    charge10to80Min: 25, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "sedan", seats: 5,
    imageUrl: "/cars/tesla-model3.png",
    grabFriendly: false,
    highlight: "Autopilot ระบบขับอัตโนมัติ",
  },
  {
    id: "tesla-modely",
    brand: "Tesla", model: "Model Y", year: 2024,
    priceMin: 1989000, priceMax: 2589000,
    batteryKwh: 82, rangeKm: 533,
    chargeDcKw: 250, chargeAcKw: 11,
    charge10to80Min: 20, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    grabFriendly: false,
    highlight: "SUV ขายดีที่สุดในโลก",
  },

  // GWM / Ora
  {
    id: "ora-goodcat",
    brand: "GWM", model: "Ora Good Cat", year: 2024,
    priceMin: 849000, priceMax: 1049000,
    batteryKwh: 63, rangeKm: 500,
    chargeDcKw: 80, chargeAcKw: 6.6,
    charge10to80Min: 36, chargeFullHr: 9,
    connectors: ["CCS2", "Type 2"],
    segment: "city", seats: 5,
    imageUrl: "/cars/ora-goodcat.png",
    grabFriendly: false,
    highlight: "ดีไซน์ retro สุดน่ารัก",
  },

  // Volvo
  {
    id: "volvo-ex30",
    brand: "Volvo", model: "EX30", year: 2024,
    priceMin: 1790000, priceMax: 2190000,
    batteryKwh: 69, rangeKm: 476,
    chargeDcKw: 153, chargeAcKw: 11,
    charge10to80Min: 26, chargeFullHr: 7,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    grabFriendly: false,
    highlight: "ยูโรเปี้ยน safety สูงสุด",
  },

  // BMW
  {
    id: "bmw-i4",
    brand: "BMW", model: "i4", year: 2024,
    priceMin: 3299000, priceMax: 4199000,
    batteryKwh: 83.9, rangeKm: 590,
    chargeDcKw: 205, chargeAcKw: 11,
    charge10to80Min: 31, chargeFullHr: 8.5,
    connectors: ["CCS2", "Type 2"],
    segment: "sedan", seats: 5,
    grabFriendly: false,
    highlight: "Luxury Sedan สมรรถนะสูง",
  },

  // Deepal
  {
    id: "deepal-s07",
    brand: "Deepal", model: "S07", year: 2024,
    priceMin: 1099000, priceMax: 1299000,
    batteryKwh: 80.64, rangeKm: 520,
    chargeDcKw: 120, chargeAcKw: 11,
    charge10to80Min: 30, chargeFullHr: 8,
    connectors: ["CCS2", "Type 2"],
    segment: "suv", seats: 5,
    grabFriendly: false,
    highlight: "AI assistant ในตัว",
  },
];

export const BRANDS = [...new Set(EV_CARS.map(c => c.brand))];
export const SEGMENTS: Record<EVCar["segment"], string> = {
  city: "รถเมือง",
  sedan: "ซีดาน",
  suv: "SUV",
  mpv: "MPV",
  pickup: "กระบะ",
};

export function formatPrice(price: number) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(2)} ล้าน`;
  return `${(price / 1000).toFixed(0)}K`;
}
