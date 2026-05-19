import { personAvatarHtml } from '../avatar.js';
import { approveQueueForTab, approveTabCounts } from '../data/approve-data.js';
import { createLucideIcon } from '../icons.js';
import { bindInboxFilterBar } from '../inbox-filter-bar.js';
import { bindLucideIcons } from '../page-utils.js';
import { merchantIconHtml } from '../receipt-icon.js';
import { merchantCodeLabel, merchantRowTitle } from '../merchant-display.js';

function statusBadgeHtml(it) {
  if (it.rejected) return '<span class="badge badge-reject">반려</span>';
  if (it.urgent) return '<span class="badge badge-urgent">긴급</span>';
  return '<span class="approve-card__spacer" aria-hidden="true"></span>';
}

function expenseRowHtml(row) {
  return (
    '<li class="approve-expense-item">' +
    merchantIconHtml(row.merchantCode, 'colored') +
    '<div class="approve-expense-item__body">' +
    '<span class="approve-expense-item__title">' +
    merchantRowTitle(row) +
    '</span>' +
    '<span class="approve-expense-item__meta">' +
    merchantCodeLabel(row.merchantCode) +
    '</span>' +
    '</div>' +
    '<span class="approve-expense-item__amount">' +
    row.amount +
    '원</span>' +
    '</li>'
  );
}

function expenseStripHtml(it, cardIndex) {
  const hasExpenses = it.expenses?.length > 0;
  const panelId = 'approve-expenses-' + cardIndex;

  const toggle = hasExpenses
    ? '<button type="button" class="approve-queue-expense-strip__toggle" aria-expanded="false" aria-controls="' +
      panelId +
      '">' +
      '<span class="approve-queue-expense-strip__label">경비 항목 <b>' +
      it.cnt +
      '건</b></span>' +
      '<span class="approve-queue-expense-strip__chevron" aria-hidden="true">' +
      createLucideIcon('chevron-down', 16, 'currentColor') +
      '</span></button>'
    : '<span class="approve-queue-expense-strip__label">경비 항목 <b>' + it.cnt + '건</b></span>';

  const panel = hasExpenses
    ? '<ul class="approve-expense-list" id="' +
      panelId +
      '" hidden>' +
      it.expenses.map(expenseRowHtml).join('') +
      '</ul>'
    : '';

  return (
    '<div class="approve-queue-expense-strip">' +
    toggle +
    '<strong class="approve-queue-expense-strip__amount">' +
    it.amt +
    '원</strong></div>' +
    panel
  );
}

function cardHtml(it, cardIndex) {
  return (
    '<article class="evs-card approve-card">' +
    '<div class="approve-card__head">' +
    '<div class="approve-card__user">' +
    personAvatarHtml(it.avatar, it.name, 36) +
    '<div><div class="approve-card__name">' +
    it.name +
    ' · ' +
    it.title +
    '</div><div class="approve-card__sub">제출 ' +
    it.submitted +
    '</div></div></div>' +
    statusBadgeHtml(it) +
    '</div>' +
    '<h3 class="approve-card__title">' +
    it.reportTitle +
    '</h3>' +
    expenseStripHtml(it, cardIndex) +
    '<div class="approve-card__actions">' +
    '<button type="button" class="approve-btn approve-btn--ghost">거절</button>' +
    '<button type="button" class="approve-btn approve-btn--primary">승인</button>' +
    '</div></article>'
  );
}

function setExpensePanelOpen(toggle, open) {
  const panel = toggle.closest('.approve-card')?.querySelector('.approve-expense-list');
  if (!panel) return;

  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
  toggle.classList.toggle('is-open', open);

  const chevron = toggle.querySelector('.approve-queue-expense-strip__chevron');
  if (chevron) {
    chevron.innerHTML = createLucideIcon(open ? 'chevron-up' : 'chevron-down', 16, 'currentColor');
  }
}

export function initPage(root, params) {
  bindLucideIcons(root);
  bindInboxFilterBar(root);

  const validTabs = ['all', 'urgent', 'rejected'];
  let tab = params?.get('tab') || 'all';
  if (!validTabs.includes(tab)) tab = 'all';
  const list = root.querySelector('#approveQueueList');
  const tabs = root.querySelectorAll('.evs-tab[data-tab]');

  if (list && !list.dataset.expenseToggleBound) {
    list.dataset.expenseToggleBound = '1';
    list.addEventListener('click', (e) => {
      const toggle = e.target.closest('.approve-queue-expense-strip__toggle');
      if (!toggle) return;
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setExpensePanelOpen(toggle, open);
    });
  }

  function render() {
    const items = approveQueueForTab(tab);
    const counts = approveTabCounts();

    tabs.forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === tab);
      const countEl = t.querySelector('.count');
      if (countEl) countEl.textContent = String(counts[t.dataset.tab] ?? '');
    });

    if (list) {
      list.innerHTML = items.length
        ? items.map((it, i) => cardHtml(it, i)).join('')
        : '<p class="approve-queue-empty">표시할 항목이 없습니다.</p>';
    }
  }

  tabs.forEach((el) => {
    el.addEventListener('click', () => {
      tab = el.dataset.tab || 'all';
      history.replaceState(null, '', '#/approve?tab=' + tab);
      render();
    });
  });

  render();

  return () => {};
}
