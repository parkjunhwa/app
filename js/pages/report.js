import { merchantIconHtml } from '../receipt-icon.js';
import { merchantRowSub, merchantRowTitle } from '../merchant-display.js';
import { personAvatarHtml } from '../avatar.js';
import { REPORT_APPROVAL_LINE, REPORT_EXPENSES } from '../data/report-data.js';
import { bindLucideIcons } from '../page-utils.js';
import { createLucideIcon } from '../icons.js';
import { hideDxLicenseBanner, waitForDevExtreme } from '../devextreme-init.js';

function expenseRowHtml(row) {
  return (
    '<div class="report-expense-row">' +
    merchantIconHtml(row.merchantCode, 'colored') +
    '<div class="receipt-main"><div class="receipt-title">' +
    merchantRowTitle(row) +
    '</div><div class="receipt-sub">' +
    merchantRowSub(row) +
    '</div></div>' +
    '<div class="receipt-right"><div class="receipt-amount">' +
    row.amount +
    '원</div></div></div>'
  );
}

function approvalLineHtml() {
  return REPORT_APPROVAL_LINE.map((p, idx) => {
    const sep = idx > 0 ? '<span class="approval-line__sep" aria-hidden="true">→</span>' : '';
    return (
      sep +
      '<div class="approval-line__person">' +
      personAvatarHtml(p.avatar, p.name, 44) +
      '<div class="approval-line__meta"><div class="approval-line__role">' +
      p.role +
      '</div><div class="approval-line__name">' +
      p.name +
      '</div></div></div>'
    );
  }).join('');
}

export function initPage(root) {
  bindLucideIcons(root);
  const widgets = [];

  const listEl = root.querySelector('#reportExpenseList');
  if (listEl) {
    listEl.innerHTML = REPORT_EXPENSES.map(expenseRowHtml).join('');
  }

  const approvalEl = root.querySelector('#reportApprovalLine');
  if (approvalEl) {
    approvalEl.innerHTML = approvalLineHtml();
  }

  const attachEl = root.querySelector('#reportAttachIcon');
  if (attachEl) {
    attachEl.innerHTML = createLucideIcon('file-text', 20, 'var(--w-blue)');
  }

  const attachClose = root.querySelector('#reportAttachClose');
  if (attachClose) {
    attachClose.innerHTML = createLucideIcon('x', 18, 'var(--w-ink-4)');
  }

  root.querySelector('#reportSubmit')?.addEventListener('click', () => {
    alert('제출 (목업)');
  });

  waitForDevExtreme().then(() => {
    const memoFormEl = root.querySelector('#reportMemoForm');
    if (!memoFormEl) return;

    widgets.push(
      $(memoFormEl)
        .dxForm({
          formData: { memo: '' },
          showColonAfterLabel: false,
          labelLocation: 'top',
          items: [
            {
              dataField: 'memo',
              label: { visible: false },
              editorType: 'dxTextArea',
              editorOptions: {
                placeholder: '메모를 입력하세요.',
                height: 88,
                autoResizeEnabled: false,
              },
            },
          ],
        })
        .dxForm('instance'),
    );
    hideDxLicenseBanner();
    requestAnimationFrame(hideDxLicenseBanner);
  });

  return () => {
    widgets.forEach((w) => {
      try {
        w?.dispose();
      } catch (_) {
        /* ignore */
      }
    });
  };
}
