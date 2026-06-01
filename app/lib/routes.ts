// นัท สิริมงคล — Data: เส้นทางยอดนิยม EV

export type EVRoute = {
  slug: string;
  from: string;
  to: string;
  distKm: number;
  durationHr: number;
  stops: {
    name: string;
    km: number;
    network: string;
    dcKw: number;
    chargeMin: number;
    tip: string;
    required: boolean;
  }[];
  highlights: string[];
  bestCar: string;
  description: string;
};

export const EV_ROUTES: EVRoute[] = [
  {
    slug: "bangkok-chiangmai",
    from: "กรุงเทพฯ", to: "เชียงใหม่",
    distKm: 696, durationHr: 8,
    stops: [
      { name: "EA Anywhere นครสวรรค์", km: 290, network: "EA Anywhere", dcKw: 120, chargeMin: 25, tip: "แวะกินข้าวกลางวัน", required: true },
      { name: "EA Anywhere ลำปาง", km: 580, network: "EA Anywhere", dcKw: 120, chargeMin: 20, tip: "ชาร์จระหว่างพักกาแฟ", required: true },
    ],
    highlights: ["ผ่านดอยขุนตาล", "วิวสวยบนดอย", "ทางด่วนตลอด"],
    bestCar: "BYD Seal / Tesla Model 3 (ระยะ > 500 กม.)",
    description: "เส้นทางยอดนิยมอันดับ 1 ของชาว EV ไทย ระยะ 696 กม. แวะชาร์จ 2 จุด ใช้เวลาเพิ่มจากรถน้ำมันแค่ 45 นาที",
  },
  {
    slug: "bangkok-phuket",
    from: "กรุงเทพฯ", to: "ภูเก็ต",
    distKm: 862, durationHr: 11,
    stops: [
      { name: "PTT EV ชุมพร", km: 480, network: "PTT EV Station", dcKw: 100, chargeMin: 30, tip: "แวะกินอาหารใต้", required: true },
      { name: "EA Anywhere สุราษฎร์ธานี", km: 640, network: "EA Anywhere", dcKw: 120, chargeMin: 20, tip: "ชาร์จระหว่างพักน้ำ", required: true },
      { name: "EA Anywhere พังงา", km: 820, network: "EA Anywhere", dcKw: 50, chargeMin: 15, tip: "ชาร์จนิดหน่อยให้ถึงภูเก็ต", required: false },
    ],
    highlights: ["ผ่านเส้นทางชายทะเล", "วิวอ่าวไทย", "ภูเก็ตมีสถานีชาร์จครบ"],
    bestCar: "Tesla Model Y / BYD Atto 3",
    description: "เส้นทางยาวที่สุดในลิสต์ 862 กม. แต่ถ้าวางแผนดี แวะแค่ 2-3 จุด ถึงภูเก็ตสบาย",
  },
  {
    slug: "bangkok-khonkaen",
    from: "กรุงเทพฯ", to: "ขอนแก่น",
    distKm: 449, durationHr: 5,
    stops: [
      { name: "EA Anywhere สระบุรี", km: 200, network: "EA Anywhere", dcKw: 120, chargeMin: 15, tip: "แวะสั้นๆ เติมแบตไปต่อ", required: false },
    ],
    highlights: ["ทางหลวง 2 เลนกว้าง", "เส้นทางสะดวกรวดเร็ว", "ขอนแก่นมีสถานีครบ"],
    bestCar: "BYD Dolphin / MG4 (แบต > 400 กม. ไม่ต้องแวะ)",
    description: "เส้นทางอีสาน 449 กม. ถ้าแบตรถ > 450 กม. ไม่ต้องแวะเลย ถึงขอนแก่นแบตเหลือ 15-20%",
  },
  {
    slug: "bangkok-huahin",
    from: "กรุงเทพฯ", to: "หัวหิน",
    distKm: 245, durationHr: 3,
    stops: [],
    highlights: ["ไม่ต้องแวะชาร์จเลย", "ทะเลใกล้กรุงเทพ", "ชาร์จที่รีสอร์ทได้"],
    bestCar: "ทุกรุ่น (แม้แต่ Neta V ก็ถึง)",
    description: "เส้นทางสุดง่าย 245 กม. ทุกรุ่นถึงโดยไม่ต้องแวะชาร์จ เหมาะสำหรับ EV มือใหม่",
  },
  {
    slug: "bangkok-pattaya",
    from: "กรุงเทพฯ", to: "พัทยา",
    distKm: 147, durationHr: 2,
    stops: [],
    highlights: ["ใกล้ที่สุด ง่ายที่สุด", "ไม่ต้องชาร์จเลย", "พัทยามีสถานีครบมาก"],
    bestCar: "ทุกรุ่น",
    description: "แค่ 147 กม. ออกจากบ้านแบตเต็มก็ถึงพัทยาแล้ว เส้นทางที่เหมาะที่สุดสำหรับ EV มือใหม่",
  },
  {
    slug: "bangkok-khaoyai",
    from: "กรุงเทพฯ", to: "เขาใหญ่",
    distKm: 195, durationHr: 2.5,
    stops: [],
    highlights: ["อากาศเย็น", "ไม่ต้องชาร์จไป", "ชาร์จที่รีสอร์ทได้"],
    bestCar: "ทุกรุ่น",
    description: "195 กม. ไปได้ทุกรุ่นโดยไม่แวะชาร์จ มีสถานีชาร์จในเขาใหญ่หลายจุด",
  },
];

export function getRoute(slug: string) {
  return EV_ROUTES.find(r => r.slug === slug);
}
