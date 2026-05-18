/**
 * DevExtreme 24.2.7 공통 초기화
 */
const DX_LICENSE_SELECTORS = [
  '.dx-license',
  '.dx-license-trigger',
  '[class*="dx-license"]',
].join(',');

/** 평가판 라이선스 배너·트리거 DOM 제거 (보고서 dxForm 등에서 재삽입될 수 있음) */
export function hideDxLicenseBanner() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll(DX_LICENSE_SELECTORS).forEach((el) => {
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.remove();
  });
}

function watchDxLicenseBanner() {
  if (typeof document === 'undefined') return;
  hideDxLicenseBanner();
  if (window.__evsDxLicenseObserver) return;
  const target = document.body;
  if (!target) return;
  window.__evsDxLicenseObserver = new MutationObserver(() => {
    hideDxLicenseBanner();
  });
  window.__evsDxLicenseObserver.observe(target, { childList: true, subtree: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchDxLicenseBanner, { once: true });
  } else {
    watchDxLicenseBanner();
  }
}

export function assertDevExtremeVersion() {
  if (typeof DevExpress === 'undefined') {
    console.error('[EVS] DevExpress가 로드되지 않았습니다.');
    return false;
  }
  if (typeof DevExpress.assertDevExtremeVersion === 'function') {
    DevExpress.assertDevExtremeVersion('DevExtreme', '24.2.7');
  }
  DevExpress.config({ serverDecimalSeparator: '.' });
  watchDxLicenseBanner();
  return true;
}

export function waitForDevExtreme(maxRetries = 50) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tick = () => {
      n += 1;
      if (typeof window.$ !== 'undefined' && typeof window.DevExpress !== 'undefined' && window.$.fn?.dxTextBox) {
        assertDevExtremeVersion();
        resolve();
        return;
      }
      if (n >= maxRetries) {
        reject(new Error('DevExtreme 로드 타임아웃'));
        return;
      }
      setTimeout(tick, 100);
    };
    tick();
  });
}

export function disposePageWidgets(root) {
  if (!root || typeof $ === 'undefined') return;
  $(root).find('.dx-widget').each(function eachWidget() {
    const names = Object.keys(this).filter((k) => k.startsWith('dx'));
    names.forEach((key) => {
      const inst = this[key];
      if (inst && typeof inst.dispose === 'function') {
        try {
          inst.dispose();
        } catch (_) {
          /* ignore */
        }
      }
    });
  });
}
