import { MERCHANT_CODE_GROUPS, merchantCodeGroup } from './data/industry-codes.js';
import { MERCHANT_CODES } from './data/merchant-codes.data.js';

/** @type {Record<string, string>} */
const LABEL_BY_CODE = Object.fromEntries(
  MERCHANT_CODES.map(({ code, label }) => [code, String(label).replace(/\s+/g, ' ').trim()])
);

/**
 * 4자리 업종코드 → 마스터 한글 라벨 (예: 8301 → 제과점)
 * @param {string|number} rawCode
 */
export function merchantCodeLabel(rawCode) {
  const key = String(rawCode ?? '').trim();
  if (LABEL_BY_CODE[key]) return LABEL_BY_CODE[key];
  const padded = key.padStart(4, '0');
  return LABEL_BY_CODE[padded] ?? '기타업종';
}

/**
 * 4자리 업종코드 → mc-* 그룹 표시명 (예: 8301 → 음식/식당)
 * @param {string|number} rawCode
 */
export function merchantGroupLabel(rawCode) {
  return MERCHANT_CODE_GROUPS[merchantCodeGroup(rawCode)]?.label ?? '서비스/기타';
}

/**
 * 목록 제목 — 가맹점명이 있으면 우선, 없으면 업종 라벨
 * @param {{ merchantCode: string; storeName?: string }} row
 */
export function merchantRowTitle(row) {
  const store = row.storeName?.trim();
  if (store) return store;
  return merchantCodeLabel(row.merchantCode);
}

/**
 * 목록 부제 — 날짜/시간 + 업종 라벨
 * @param {{ merchantCode: string; date?: string; dateTime?: string }} row
 * @param {{ separator?: string }} [opts]
 */
export function merchantRowSub(row, opts = {}) {
  const sep = opts.separator ?? ' · ';
  const industry = merchantCodeLabel(row.merchantCode);
  if (row.dateTime) return `${row.dateTime}${sep}${industry}`;
  if (row.date) return `${row.date}${sep}${industry}`;
  return industry;
}
