/** 홈 칩(탭)별 summary-card 데이터만 탭 전환 시 갱신 */
export const HOME_SUMMARY_BY_TAB = {
  all: {
    label: '이번 달 사용 금액 ›',
    month: '5월',
    amount: '780,000',
    today: '125,000',
    progress: 62,
    budget: '1,250,000',
  },
  need: {
    label: '미처리 카드 사용액 ›',
    month: '5월',
    amount: '142,000',
    today: '38,000',
    progress: 28,
    budget: '500,000',
  },
  unsubmitted: {
    label: '미제출 경비 합계 ›',
    month: '5월',
    amount: '96,500',
    today: '0',
    progress: 15,
    budget: '650,000',
  },
  approve: {
    label: '승인 대기 금액 ›',
    month: '5월',
    amount: '218,000',
    today: '45,000',
    progress: 41,
    budget: '530,000',
  },
  month: {
    label: '이번 달 사용 금액 ›',
    month: '5월',
    amount: '780,000',
    today: '125,000',
    progress: 62,
    budget: '1,250,000',
  },
};

export const HOME_TAB_KEYS = ['all', 'need', 'unsubmitted', 'approve', 'month'];

/** 퀵카드·최근 내역 — 탭과 무관하게 고정 */
export const HOME_QUICK = { need: 3, unsubmitted: 2, approve: 1 };

export const HOME_RECENT = [
  { title: '스타벅스 강남점', sub: '식대', amount: '4,500', date: '05.11', industryCode: 'code001', expenseCode: 'exp001' },
  { title: '택시', sub: '교통비', amount: '18,000', date: '05.11', industryCode: 'code002', expenseCode: 'exp002' },
  { title: '점심 식사', sub: '식대', amount: '12,000', date: '05.10', industryCode: 'code003', expenseCode: 'exp001' },
];
