"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export type FilterState = {
  province: string;
  chargerType: string;
  operator: string;
};

const PROVINCES = [
  // ภาคกลาง
  "กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "สมุทรสาคร",
  "สมุทรสงคราม", "นครปฐม", "สุพรรณบุรี", "กาญจนบุรี", "ราชบุรี",
  "เพชรบุรี", "ประจวบคีรีขันธ์", "อ่างทอง", "พระนครศรีอยุธยา", "ลพบุรี",
  "สระบุรี", "ชัยนาท", "สิงห์บุรี", "นครนายก", "ปราจีนบุรี",
  "สระแก้ว", "ฉะเชิงเทรา", "ชลบุรี", "ระยอง", "จันทบุรี", "ตราด",
  // ภาคเหนือ
  "เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน", "แม่ฮ่องสอน",
  "พะเยา", "น่าน", "แพร่", "อุตรดิตถ์", "ตาก",
  "สุโขทัย", "พิษณุโลก", "พิจิตร", "กำแพงเพชร", "นครสวรรค์",
  "อุทัยธานี",
  // ภาคตะวันออกเฉียงเหนือ
  "ขอนแก่น", "อุดรธานี", "นครราชสีมา", "บึงกาฬ", "หนองคาย",
  "หนองบัวลำภู", "เลย", "สกลนคร", "นครพนม", "มุกดาหาร",
  "กาฬสินธุ์", "มหาสารคาม", "ร้อยเอ็ด", "ยโสธร", "อำนาจเจริญ",
  "อุบลราชธานี", "ศรีสะเกษ", "สุรินทร์", "บุรีรัมย์", "ชัยภูมิ",
  // ภาคใต้
  "สุราษฎร์ธานี", "นครศรีธรรมราช", "ภูเก็ต", "กระบี่", "พังงา",
  "ระนอง", "ชุมพร", "สงขลา", "สตูล", "ตรัง",
  "พัทลุง", "ปัตตานี", "ยะลา", "นราธิวาส",
];

const CHARGER_TYPES = [
  { value: "", label: "ทุกประเภท" },
  { value: "ac", label: "AC" },
  { value: "dc", label: "DC" },
  { value: "fast", label: "Fast 50kW+" },
];

const OPERATORS = [
  { value: "", label: "ทุกเครือข่าย" },
  { value: "ea-anywhere", label: "EA Anywhere" },
  { value: "ptt-ev", label: "PTT EV" },
  { value: "sharge", label: "Sharge" },
  { value: "mg-charging", label: "MG" },
  { value: "byd-charging", label: "BYD" },
];

type Props = {
  onFilter: (f: FilterState) => void;
  stationCount: number;
  initialOperator?: string;
};

export default function SearchFilter({ onFilter, stationCount, initialOperator = "" }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [operator, setOperator] = useState(initialOperator);

  const current = (): FilterState => ({
    province: PROVINCES.includes(inputValue) ? inputValue : "",
    chargerType,
    operator,
  });

  const applyProvince = (val: string) => {
    const matched = PROVINCES.includes(val) ? val : "";
    onFilter({ province: matched, chargerType, operator });
  };

  const applyChargerType = (c: string) => {
    setChargerType(c);
    const matched = PROVINCES.includes(inputValue) ? inputValue : "";
    onFilter({ province: matched, chargerType: c, operator });
  };

  const applyOperator = (op: string) => {
    setOperator(op);
    const matched = PROVINCES.includes(inputValue) ? inputValue : "";
    onFilter({ province: matched, chargerType, operator: op });
  };

  const reset = () => {
    setInputValue("");
    setChargerType("");
    setOperator("");
    onFilter({ province: "", chargerType: "", operator: "" });
  };

  const hasFilter = inputValue || chargerType || operator;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Province */}
      <div className="relative flex-1 max-w-[160px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          list="province-list"
          type="search"
          value={inputValue}
          placeholder="จังหวัด..."
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            applyProvince(val);
          }}
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          aria-label="ค้นหาจังหวัด"
          autoComplete="off"
        />
        <datalist id="province-list">
          {PROVINCES.map((p) => <option key={p} value={p} />)}
        </datalist>
      </div>

      {/* Operator dropdown */}
      <select
        value={operator}
        onChange={(e) => applyOperator(e.target.value)}
        className={`py-2 pl-2.5 pr-7 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors ${
          operator ? "border-green-400 text-green-700 font-semibold" : "border-gray-200 text-gray-500"
        }`}
      >
        {OPERATORS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Charger type pills */}
      <div className="flex items-center gap-1">
        {CHARGER_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => applyChargerType(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chargerType === t.value
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <span className="text-xs text-gray-400 whitespace-nowrap hidden lg:block">
        <span className="font-semibold text-gray-700">{stationCount}</span> สถานี
      </span>

      {hasFilter && (
        <button
          onClick={reset}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="ล้างตัวกรอง"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
