/** DevExtreme 평가판 라이선스 배너 제거 — dx.all.js 직후 동기 로드 (index.html, login.html) */
(function hideDxLicenseModule() {
  const DX_LICENSE_SELECTORS = [
    'dx-license',
    'dx-license-trigger',
    '.dx-license',
    '.dx-license-trigger',
    '[class*="dx-license"]',
  ].join(',');

  function hideDxLicenseBanner() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll(DX_LICENSE_SELECTORS).forEach((el) => {
      el.remove();
    });
  }

  function watchDxLicenseBanner() {
    if (typeof document === 'undefined') return;
    hideDxLicenseBanner();
    if (window.__evsDxLicenseObserver) return;
    const target = document.documentElement;
    if (!target) return;
    window.__evsDxLicenseObserver = new MutationObserver(hideDxLicenseBanner);
    window.__evsDxLicenseObserver.observe(target, { childList: true, subtree: true });
  }

  window.__evsHideDxLicense = hideDxLicenseBanner;

  hideDxLicenseBanner();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchDxLicenseBanner, { once: true });
  } else {
    watchDxLicenseBanner();
  }
})();
