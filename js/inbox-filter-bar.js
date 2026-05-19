import { MERCHANT_CODE_GROUPS } from './data/industry-codes.js';

const FILTER_DEFAULT = 'all';

function buildMonthOptions() {
  const now = new Date();
  const parts = ['<option value="all">전체</option>'];
  for (let i = 0; i < 6; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    parts.push(`<option value="${value}">${label}</option>`);
  }
  return parts.join('');
}

function buildIndustryOptions() {
  const parts = ['<option value="all">전체</option>'];
  Object.entries(MERCHANT_CODE_GROUPS).forEach(([key, { label }]) => {
    parts.push(`<option value="${key}">${label}</option>`);
  });
  return parts.join('');
}

/**
 * 탭 하단 필터 바 — 필터 버튼으로 표시/숨김, 초기화 시 전체
 * @param {HTMLElement} root
 */
export function bindInboxFilterBar(root) {
  const tabbar = root.querySelector('.inbox-tabbar');
  if (!tabbar || tabbar.dataset.filterBound) return () => {};

  tabbar.dataset.filterBound = '1';

  const toggleBtn = tabbar.querySelector('.inbox-filter-button');
  const filterBar = tabbar.querySelector('.inbox-filter-bar');
  const resetBtn = tabbar.querySelector('.inbox-filter-bar__reset');
  const periodSelect = tabbar.querySelector('[data-filter="period"]');
  const cardSelect = tabbar.querySelector('[data-filter="card"]');
  const industrySelect = tabbar.querySelector('[data-filter="industry"]');
  const selects = [periodSelect, cardSelect, industrySelect].filter(Boolean);

  if (periodSelect) periodSelect.innerHTML = buildMonthOptions();
  if (industrySelect) industrySelect.innerHTML = buildIndustryOptions();

  function isDefault() {
    return selects.every((el) => el.value === FILTER_DEFAULT);
  }

  function syncResetButton() {
    if (resetBtn) resetBtn.disabled = isDefault();
  }

  const screen = tabbar.closest('.evs-screen');

  function syncFilterBarOffset() {
    const h =
      tabbar.classList.contains('is-filter-open') && filterBar && !filterBar.hidden
        ? filterBar.getBoundingClientRect().height
        : 0;
    const px = `${h}px`;
    tabbar.style.setProperty('--inbox-filter-measured-height', px);
    if (screen) screen.style.setProperty('--inbox-filter-offset', px);
  }

  function setOpen(open) {
    tabbar.classList.toggle('is-filter-open', open);
    if (filterBar) filterBar.hidden = !open;
    if (toggleBtn) {
      toggleBtn.classList.toggle('is-open', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    requestAnimationFrame(syncFilterBarOffset);
  }

  function resetFilters() {
    selects.forEach((el) => {
      el.value = FILTER_DEFAULT;
    });
    syncResetButton();
  }

  if (toggleBtn && filterBar) {
    const panelId = filterBar.id || 'inboxFilterPanel';
    if (!filterBar.id) filterBar.id = panelId;
    toggleBtn.setAttribute('aria-controls', panelId);
  }

  toggleBtn?.addEventListener('click', () => {
    setOpen(!tabbar.classList.contains('is-filter-open'));
  });

  resetBtn?.addEventListener('click', resetFilters);

  selects.forEach((el) => {
    el.addEventListener('change', syncResetButton);
  });

  const onResize = () => syncFilterBarOffset();
  window.addEventListener('resize', onResize);
  const resizeObserver =
    filterBar && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => syncFilterBarOffset())
      : null;
  resizeObserver?.observe(filterBar);

  setOpen(false);
  syncResetButton();

  return () => {
    window.removeEventListener('resize', onResize);
    resizeObserver?.disconnect();
  };
}
