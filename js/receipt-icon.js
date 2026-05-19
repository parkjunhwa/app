import { MERCHANT_CODE_GROUPS, merchantCodeGroup } from './data/industry-codes.js';
import { iconShapeSvg } from './industry-icon-shapes.js';

const MERCHANT_CODE_RE = /^\d{4}$/;

function buildIconHtml({ baseClass, code, shape, variant }) {
  const classes = [baseClass, code, `shape-${shape}`];
  if (variant === 'neutral') classes.push(`${baseClass}--neutral`);
  return `<span class="${classes.join(' ')}" aria-hidden="true">${iconShapeSvg(shape)}</span>`;
}

/**
 * 가맹점 4자리 업종코드 아이콘
 * — class: receipt-icon mc-{group} shape-{shape}
 * @param {string|number} rawMerchantCode 예: '8001', 1001
 * @param {'colored'|'neutral'} variant
 */
export function merchantIconHtml(rawMerchantCode, variant = 'colored') {
  const key = String(rawMerchantCode ?? '').trim();
  if (!MERCHANT_CODE_RE.test(key)) {
    console.warn('[EVS] merchantIconHtml: 4자리 업종코드가 필요합니다.', rawMerchantCode);
    return buildIconHtml({
      baseClass: 'receipt-icon',
      code: MERCHANT_CODE_GROUPS.service.colorClass,
      shape: MERCHANT_CODE_GROUPS.service.shape,
      variant,
    });
  }
  const group = merchantCodeGroup(key);
  const { shape, colorClass } = MERCHANT_CODE_GROUPS[group];
  return buildIconHtml({ baseClass: 'receipt-icon', code: colorClass, shape, variant });
}

/** @deprecated merchantIconHtml 사용 */
export const merchantOrReceiptIconHtml = merchantIconHtml;

/** @deprecated merchantIconHtml 사용 */
export const receiptIconHtml = merchantIconHtml;

/** @deprecated merchantIconHtml 사용 — 경비 유형은 merchantCode(가맹점)로 표시 */
export const expenseIconHtml = merchantIconHtml;

export { merchantIconMeta } from './data/industry-codes.js';
