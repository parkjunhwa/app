import { personAvatarHtml } from '../avatar.js';
import { approveQueueForTab, approveTabCounts } from '../data/approve-data.js';
import { bindLucideIcons } from '../page-utils.js';

function statusBadgeHtml(it) {
  if (it.rejected) return '<span class="badge badge-reject">반려</span>';
  if (it.urgent) return '<span class="badge badge-urgent">긴급</span>';
  return '<span class="approve-card__spacer" aria-hidden="true"></span>';
}

function cardHtml(it) {
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
    '<div class="approve-queue-expense-strip">' +
    '<span>경비 항목 <b>' +
    it.cnt +
    '건</b></span>' +
    '<strong>' +
    it.amt +
    '원</strong>' +
    '</div>' +
    '<div class="approve-card__actions">' +
    '<button type="button" class="approve-btn approve-btn--ghost">거절</button>' +
    '<button type="button" class="approve-btn approve-btn--primary">승인</button>' +
    '</div></article>'
  );
}

export function initPage(root, params) {
  bindLucideIcons(root);

  const validTabs = ['all', 'urgent', 'rejected'];
  let tab = params?.get('tab') || 'all';
  if (!validTabs.includes(tab)) tab = 'all';
  const list = root.querySelector('#approveQueueList');
  const tabs = root.querySelectorAll('.evs-tab[data-tab]');

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
        ? items.map(cardHtml).join('')
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
