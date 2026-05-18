export const APPROVE_QUEUE = [
  {
    name: '홍길동',
    title: '사원',
    submitted: '2026-05-11',
    reportTitle: '5월 경비보고서',
    amt: '34,500',
    cnt: 3,
    urgent: true,
    rejected: false,
    avatar: 3,
  },
  {
    name: '김철수',
    title: '대리',
    submitted: '2026-05-11',
    reportTitle: '5월 경비보고서',
    amt: '28,000',
    cnt: 2,
    urgent: false,
    rejected: false,
    avatar: 4,
  },
  {
    name: '이영희',
    title: '사원',
    submitted: '2026-05-10',
    reportTitle: '4월 경비보고서',
    amt: '120,000',
    cnt: 5,
    urgent: false,
    rejected: true,
    avatar: 5,
  },
];

export function approveQueueForTab(tab) {
  if (tab === 'urgent') return APPROVE_QUEUE.filter((item) => item.urgent);
  if (tab === 'rejected') return APPROVE_QUEUE.filter((item) => item.rejected);
  return APPROVE_QUEUE;
}

export function approveTabCounts() {
  return {
    all: APPROVE_QUEUE.length,
    urgent: APPROVE_QUEUE.filter((item) => item.urgent).length,
    rejected: APPROVE_QUEUE.filter((item) => item.rejected).length,
  };
}
