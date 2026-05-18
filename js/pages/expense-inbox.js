import { receiptIconHtml } from '../receipt-icon.js';
import { initialSelected, inboxRowsForMode, inboxTabCounts, INBOX_SUB } from '../data/inbox-data.js';
import { bindLucideIcons } from '../page-utils.js';
import { createLucideIcon } from '../icons.js';

function fmt(n) {
  return Number(n).toLocaleString('ko-KR');
}

function badgeHtml(status) {
  if (status === 'need') return '<span class="badge badge-need">영수증 필요</span>';
  if (status === 'done') return '<span class="badge badge-done">처리완료</span>';
  if (status === 'wait') return '<span class="badge badge-wait">승인대기</span>';
  return '';
}

function checkHtml(checked) {
  return (
    '<span class="evs-check evs-check--round' +
    (checked ? ' on' : '') +
    '" aria-hidden="true">' +
    '<span class="evs-check__icon" data-lucide="check" data-lucide-size="14"></span>' +
    '</span>'
  );
}

function rowHtml(r, i, mode, selected) {
  const st = r.status[mode] || 'need';
  const sel = selected[i] ? ' selected' : '';
  return (
    '<button type="button" class="receipt-row' +
    sel +
    '" data-idx="' +
    i +
    '" aria-pressed="' +
    selected[i] +
    '">' +
    checkHtml(selected[i]) +
    receiptIconHtml(r.industryCode, 'colored') +
    '<div class="receipt-main"><div class="receipt-title">' +
    r.title +
    '</div><div class="receipt-sub">' +
    r.sub +
    '</div></div>' +
    '<div class="receipt-right"><div class="receipt-amount">' +
    fmt(r.amount) +
    '원</div>' +
    badgeHtml(st) +
    '</div></button>'
  );
}

export function initPage(root, params) {
  bindLucideIcons(root);

  let mode = params.get('mode') || 'need';
  let rows = inboxRowsForMode(mode);
  let selected = initialSelected(mode, rows);

  const listEl = root.querySelector('#inboxList');
  const subEl = root.querySelector('#inboxSubtext');
  const tabs = root.querySelectorAll('.evs-tab[data-mode]');
  const actionEl = root.querySelector('#inboxAction');
  const btnAdd = root.querySelector('#inboxBtnAdd');
  const btnEdit = root.querySelector('#inboxBtnEdit');
  const btnDelete = root.querySelector('#inboxBtnDelete');

  if (actionEl && !actionEl.querySelector('.action-bar__icon')) {
    const label = actionEl.textContent.trim();
    actionEl.textContent = '';
    const iconWrap = document.createElement('span');
    iconWrap.className = 'action-bar__icon';
    iconWrap.innerHTML = createLucideIcon('file-text', 18, '#fff');
    actionEl.appendChild(iconWrap);
    const text = document.createElement('span');
    text.className = 'action-bar__text';
    text.textContent = label;
    actionEl.appendChild(text);
  }

  function render() {
    rows = inboxRowsForMode(mode);
    if (selected.length !== rows.length) {
      selected = initialSelected(mode, rows);
    }

    subEl.textContent = INBOX_SUB[mode] || INBOX_SUB.need;
    const tabCounts = inboxTabCounts();
    tabs.forEach((t) => {
      t.classList.toggle('active', t.dataset.mode === mode);
      const countEl = t.querySelector('.count');
      if (countEl) countEl.textContent = String(tabCounts[t.dataset.mode] ?? '');
    });
    listEl.innerHTML = rows.map((r, i) => rowHtml(r, i, mode, selected)).join('');

    const count = selected.filter(Boolean).length;
    const sum = rows.reduce((s, r, i) => (selected[i] ? s + Number(r.amount) : s), 0);
    root.querySelector('#selectedCount').textContent = count;
    root.querySelector('#footerCount').textContent = count;
    root.querySelector('#footerSum').textContent = fmt(sum) + '원';
    const actionLabel = mode === 'done' ? '선택 항목 수정' : '선택 항목 처리';
    const actionText = actionEl.querySelector('.action-bar__text');
    if (actionText) actionText.textContent = actionLabel + ' (' + count + ')';
    const checkAll = root.querySelector('#checkAll');
    if (checkAll) {
      checkAll.classList.add('evs-check--round');
      checkAll.classList.toggle('on', count === rows.length && count > 0);
    }

    if (btnEdit) btnEdit.disabled = count === 0;
    if (btnDelete) btnDelete.disabled = count === 0;

    bindLucideIcons(root);

    listEl.querySelectorAll('[data-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        selected[idx] = !selected[idx];
        render();
      });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      mode = tab.dataset.mode;
      selected = initialSelected(mode, inboxRowsForMode(mode));
      history.replaceState(null, '', '#/expense/inbox?mode=' + mode);
      render();
    });
  });

  root.querySelector('#btnSelectAll')?.addEventListener('click', () => {
    const allOn = selected.every(Boolean);
    selected = rows.map(() => !allOn);
    render();
  });

  btnAdd?.addEventListener('click', () => {
    alert('추가 (목업)');
  });
  btnEdit?.addEventListener('click', () => {
    alert('선택 수정 (목업)');
  });
  btnDelete?.addEventListener('click', () => {
    alert('선택 삭제 (목업)');
  });

  render();
  return () => {};
}
