import { merchantIconHtml } from '../receipt-icon.js';
import { merchantRowSub, merchantRowTitle } from '../merchant-display.js';
import { bindLucideIcons } from '../page-utils.js';
import { HOME_QUICK, HOME_RECENT, HOME_SUMMARY_BY_TAB, HOME_TAB_KEYS } from '../data/home-data.js';

function recentRowHtml(row) {
  return (
    '<div class="receipt-row">' +
    merchantIconHtml(row.merchantCode, 'colored') +
    '<div class="receipt-main"><div class="receipt-title">' +
    merchantRowTitle(row) +
    '</div><div class="receipt-sub">' +
    merchantRowSub(row) +
    '</div></div>' +
    '<div class="receipt-right"><div class="receipt-amount">' +
    row.amount +
    '원</div><div class="receipt-date">' +
    row.date +
    '</div></div></div>'
  );
}

function formatCount(n) {
  return `${n}건`;
}

function formatWon(n) {
  const num = Number(String(n).replace(/,/g, ''));
  if (Number.isNaN(num)) return n;
  return num.toLocaleString('ko-KR');
}

export function initPage(root) {
  bindLucideIcons(root);

  const chips = [...root.querySelectorAll('.chip-row .chip[data-home-tab]')];
  const summaryLabel = root.querySelector('#homeSummaryLabel');
  const summaryMonth = root.querySelector('#homeSummaryMonth');
  const summaryAmount = root.querySelector('#homeSummaryAmount');
  const summaryToday = root.querySelector('#homeSummaryToday');
  const summaryProgress = root.querySelector('#homeSummaryProgress');
  const summaryBudget = root.querySelector('#homeSummaryBudget');
  const summaryProgressText = root.querySelector('#homeSummaryProgressText');
  const countNeed = root.querySelector('#homeCountNeed');
  const countUnsubmitted = root.querySelector('#homeCountUnsubmitted');
  const countApprove = root.querySelector('#homeCountApprove');
  const list = root.querySelector('#homeRecentList');

  const applySummaryTab = (tabKey) => {
    const key = HOME_TAB_KEYS.includes(tabKey) ? tabKey : 'all';
    const summary = HOME_SUMMARY_BY_TAB[key];
    if (!summary) return;

    chips.forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.homeTab === key);
    });

    if (summaryLabel) summaryLabel.textContent = summary.label;
    if (summaryMonth) summaryMonth.textContent = summary.month;
    if (summaryAmount) {
      summaryAmount.innerHTML =
        formatWon(summary.amount) + '<span class="summary-card__unit">원</span>';
    }
    if (summaryToday) {
      const todayNum = Number(String(summary.today).replace(/,/g, ''));
      summaryToday.textContent =
        todayNum > 0 ? `오늘 ${formatWon(summary.today)}원 사용` : '오늘 사용 내역 없음';
    }
    if (summaryProgress) summaryProgress.style.width = `${summary.progress}%`;
    if (summaryProgressText) summaryProgressText.textContent = String(summary.progress);
    if (summaryBudget) summaryBudget.textContent = `${formatWon(summary.budget)}원`;
  };

  if (countNeed) countNeed.textContent = formatCount(HOME_QUICK.need);
  if (countUnsubmitted) countUnsubmitted.textContent = formatCount(HOME_QUICK.unsubmitted);
  if (countApprove) countApprove.textContent = formatCount(HOME_QUICK.approve);

  if (list) {
    list.innerHTML = HOME_RECENT.map(recentRowHtml).join('');
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      applySummaryTab(chip.dataset.homeTab);
    });
  });

  applySummaryTab('all');

  return () => {};
}
