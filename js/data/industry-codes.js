/**
 * 가맹점 4자리 업종코드 → mc-* 그룹
 * 색상: css/industry-code-colors.css
 * SVG shape: js/industry-icon-shapes.js
 */

/** @type {Record<string, { label: string; shape: string; colorClass: string }>} */
export const MERCHANT_CODE_GROUPS = {
  lodging: { label: '숙박', shape: 'bed', colorClass: 'mc-lodging' },
  transport: { label: '교통/여행', shape: 'transit', colorClass: 'mc-transport' },
  leisure: { label: '스포츠/레저', shape: 'trophy', colorClass: 'mc-leisure' },
  culture: { label: '문화/취미', shape: 'music', colorClass: 'mc-culture' },
  home: { label: '홈/가전', shape: 'house', colorClass: 'mc-home' },
  fuel: { label: '연료/주유', shape: 'fuel', colorClass: 'mc-fuel' },
  shopping: { label: '쇼핑/유통', shape: 'bag', colorClass: 'mc-shopping' },
  education: { label: '교육/IT', shape: 'book', colorClass: 'mc-education' },
  auto: { label: '자동차', shape: 'car', colorClass: 'mc-auto' },
  health: { label: '의료/건강', shape: 'heart', colorClass: 'mc-health' },
  food: { label: '음식/식당', shape: 'food', colorClass: 'mc-food' },
  service: { label: '서비스/기타', shape: 'gear', colorClass: 'mc-service' },
};

/**
 * 4자리 업종코드 범위 → 그룹 키
 * @type {[number, number, string][]}
 */
const MERCHANT_CODE_RANGES = [
  [1001, 1021, 'lodging'],
  [1101, 1199, 'transport'],
  [2001, 2003, 'leisure'],
  [2010, 2029, 'culture'],
  [2101, 2199, 'leisure'],
  [2201, 2299, 'culture'],
  [3001, 3299, 'home'],
  [3301, 3399, 'fuel'],
  [3401, 3499, 'shopping'],
  [4001, 4499, 'shopping'],
  [5001, 5299, 'education'],
  [6001, 6299, 'auto'],
  [7001, 7199, 'health'],
  [8001, 8499, 'food'],
  [9001, 9999, 'service'],
];

/**
 * 4자리 가맹점 업종코드 → MERCHANT_CODE_GROUPS 키
 * @param {string|number} rawCode
 * @returns {string}
 */
export function merchantCodeGroup(rawCode) {
  const n = parseInt(rawCode, 10);
  if (isNaN(n)) return 'service';
  for (const [start, end, group] of MERCHANT_CODE_RANGES) {
    if (n >= start && n <= end) return group;
  }
  return 'service';
}

/**
 * @param {string|number} rawMerchantCode
 * @returns {{ label: string; shape: string; colorClass: string }}
 */
export function merchantIconMeta(rawMerchantCode) {
  return MERCHANT_CODE_GROUPS[merchantCodeGroup(rawMerchantCode)];
}
