/**
 * 업종 코드(code001…) — 색상은 css/industry-code-colors.css
 * 아이콘 형태(shape-*) — css/industry-icon-shapes.css + js/industry-icon-shapes.js
 *
 * 가맹점 4자리 업종코드 → mc-* 그룹 매핑은 하단 MERCHANT_CODE_GROUPS / merchantCodeGroup() 참조
 */

/** @type {Record<string, { label: string; shape: string }>} */
export const INDUSTRY_CODES = {
  code001: { label: '카페/음료', shape: 'cafe' },
  code002: { label: '교통', shape: 'taxi' },
  code003: { label: '음식', shape: 'food' },
  code004: { label: '유통/편의', shape: 'store' },
  code005: { label: '주유', shape: 'fuel' },
};

/* ────────────────────────────────────────────────────────────
   가맹점 4자리 업종코드 그룹 (mc-*)
   12개 그룹 × { 표시 레이블, SVG shape 키, CSS 색상 클래스 }
   색상 클래스 → css/industry-code-colors.css
   SVG shape 키 → js/industry-icon-shapes.js
──────────────────────────────────────────────────────────── */

/** @type {Record<string, { label: string; shape: string; colorClass: string }>} */
export const MERCHANT_CODE_GROUPS = {
  lodging:   { label: '숙박',         shape: 'bed',     colorClass: 'mc-lodging'   },
  transport: { label: '교통/여행',    shape: 'transit', colorClass: 'mc-transport' },
  leisure:   { label: '스포츠/레저',  shape: 'trophy',  colorClass: 'mc-leisure'   },
  culture:   { label: '문화/취미',    shape: 'music',   colorClass: 'mc-culture'   },
  home:      { label: '홈/가전',      shape: 'house',   colorClass: 'mc-home'      },
  fuel:      { label: '연료/주유',    shape: 'fuel',    colorClass: 'mc-fuel'      },
  shopping:  { label: '쇼핑/유통',    shape: 'bag',     colorClass: 'mc-shopping'  },
  education: { label: '교육/IT',      shape: 'book',    colorClass: 'mc-education' },
  auto:      { label: '자동차',       shape: 'car',     colorClass: 'mc-auto'      },
  health:    { label: '의료/건강',    shape: 'heart',   colorClass: 'mc-health'    },
  food:      { label: '음식/식당',    shape: 'food',    colorClass: 'mc-food'      },
  service:   { label: '서비스/기타',  shape: 'gear',    colorClass: 'mc-service'   },
};

/**
 * 4자리 업종코드 범위 → 그룹 키 매핑
 * [시작코드, 끝코드, 그룹키]
 * @type {[number, number, string][]}
 */
const MERCHANT_CODE_RANGES = [
  [1001, 1021, 'lodging'],    // 특급호텔 ~ 여관/기타숙박업(할부)
  [1101, 1199, 'transport'],  // 항공사 ~ 기타교통수단
  [2001, 2003, 'leisure'],    // 골프용품 ~ 총포류판매
  [2010, 2029, 'culture'],    // 악기점 ~ 기타음반제품
  [2101, 2199, 'leisure'],    // 골프경기장 ~ 기타레져업
  [2201, 2299, 'culture'],    // 골동품 ~ 문화취미기타
  [3001, 3299, 'home'],       // 가구 ~ 기타주방용구
  [3301, 3399, 'fuel'],       // 주유소 ~ 기타연료
  [3401, 3499, 'shopping'],   // 카메라 ~ 기타광학품
  [4001, 4499, 'shopping'],   // 백화점 ~ 기타잡화
  [5001, 5299, 'education'],  // 서적 ~ 기타사무용
  [6001, 6299, 'auto'],       // 신차 ~ 기타보험
  [7001, 7199, 'health'],     // 종합병원 ~ 기타대인서비스
  [8001, 8499, 'food'],       // 한식 ~ 기타건강식
  [9001, 9999, 'service'],    // 건축자재 ~ 기타업종
];

/**
 * 4자리 가맹점 업종코드 → MERCHANT_CODE_GROUPS 키 반환
 * @param {string|number} rawCode
 * @returns {string} 그룹 키 (기본값 'service')
 */
export function merchantCodeGroup(rawCode) {
  const n = parseInt(rawCode, 10);
  if (isNaN(n)) return 'service';
  for (const [start, end, group] of MERCHANT_CODE_RANGES) {
    if (n >= start && n <= end) return group;
  }
  return 'service';
}

/** @type {Record<string, { label: string; shape: string }>} */
export const EXPENSE_CODES = {
  exp001: { label: '식대', shape: 'meal' },
  exp002: { label: '교통비', shape: 'transport' },
  exp003: { label: '숙박비', shape: 'lodging' },
};

/** 레거시 type/ic 키 → 업종 코드 */
export const LEGACY_INDUSTRY_TO_CODE = {
  cafe: 'code001',
  taxi: 'code002',
  food: 'code003',
  store: 'code004',
  fuel: 'code005',
};

/** 경비 유형명·레거시 키 → 경비 코드 */
export const LEGACY_EXPENSE_TO_CODE = {
  meal: 'exp001',
  food: 'exp001',
  식대: 'exp001',
  transport: 'exp002',
  taxi: 'exp002',
  교통비: 'exp002',
  lodging: 'exp003',
  숙박비: 'exp003',
};

const INDUSTRY_CODE_RE = /^code\d{3,}$/i;
const EXPENSE_CODE_RE = /^exp\d{3,}$/i;

export function normalizeIndustryCode(value) {
  if (!value) return 'code001';
  const key = String(value).trim();
  if (INDUSTRY_CODE_RE.test(key)) return key.toLowerCase();
  return LEGACY_INDUSTRY_TO_CODE[key] || 'code001';
}

export function normalizeExpenseCode(value) {
  if (!value) return 'exp001';
  const key = String(value).trim();
  if (EXPENSE_CODE_RE.test(key)) return key.toLowerCase();
  return LEGACY_EXPENSE_TO_CODE[key] || 'exp001';
}

export function industryShapeForCode(code) {
  return INDUSTRY_CODES[normalizeIndustryCode(code)]?.shape || 'cafe';
}

export function expenseShapeForCode(code) {
  return EXPENSE_CODES[normalizeExpenseCode(code)]?.shape || 'meal';
}
