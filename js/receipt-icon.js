import {
  MERCHANT_CODE_GROUPS,
  expenseShapeForCode,
  industryShapeForCode,
  merchantCodeGroup,
  normalizeExpenseCode,
  normalizeIndustryCode,
} from './data/industry-codes.js';
import { iconShapeSvg } from './industry-icon-shapes.js';

function buildIconHtml({ baseClass, code, shape, variant }) {
  const classes = [baseClass, code, `shape-${shape}`];
  if (variant === 'neutral') classes.push(`${baseClass}--neutral`);
  return `<span class="${classes.join(' ')}" aria-hidden="true">${iconShapeSvg(shape)}</span>`;
}

/** 레거시 사용처 업종 아이콘 — class: receipt-icon code001 shape-cafe */
export function receiptIconHtml(codeOrLegacy, variant = 'colored') {
  const code = normalizeIndustryCode(codeOrLegacy);
  const shape = industryShapeForCode(code);
  return buildIconHtml({ baseClass: 'receipt-icon', code, shape, variant });
}

/** 경비 유형 아이콘 — class: expense-icon exp001 shape-meal */
export function expenseIconHtml(codeOrLegacy, variant = 'colored') {
  const code = normalizeExpenseCode(codeOrLegacy);
  const shape = expenseShapeForCode(code);
  return buildIconHtml({ baseClass: 'expense-icon', code, shape, variant });
}

/**
 * 가맹점 4자리 업종코드 아이콘
 * — class: receipt-icon mc-{group} shape-{shape}
 * @param {string|number} rawMerchantCode  예: '8001', 1001
 * @param {'colored'|'neutral'} variant
 */
export function merchantIconHtml(rawMerchantCode, variant = 'colored') {
  const group = merchantCodeGroup(rawMerchantCode);
  const { shape, colorClass } = MERCHANT_CODE_GROUPS[group];
  return buildIconHtml({ baseClass: 'receipt-icon', code: colorClass, shape, variant });
}

/**
 * 가맹점 4자리 업종코드의 그룹 메타 반환
 * @param {string|number} rawMerchantCode
 * @returns {{ label: string; shape: string; colorClass: string }}
 */
export function merchantIconMeta(rawMerchantCode) {
  return MERCHANT_CODE_GROUPS[merchantCodeGroup(rawMerchantCode)];
}
