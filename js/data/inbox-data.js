export const INBOX_ROWS_BASE = [
  {
    industryCode: 'code001',
    title: '스타벅스 강남점',
    sub: '05.11(토) 08:32',
    amount: '4500',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 1, done: 1, all: 1 },
  },
  {
    industryCode: 'code002',
    title: '택시',
    sub: '05.11(토) 21:03',
    amount: '18000',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 1, done: 1, all: 1 },
  },
  {
    industryCode: 'code003',
    title: '점심 식사',
    sub: '05.10(금) 12:30',
    amount: '12000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 1, done: 0, all: 1 },
  },
  {
    industryCode: 'code004',
    title: '편의점',
    sub: '05.09(목) 18:20',
    amount: '3200',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 1, done: 0, all: 0 },
  },
  {
    industryCode: 'code005',
    title: '주유소',
    sub: '05.08(수) 09:15',
    amount: '50000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 1, done: 0, all: 0 },
  },
];

export const INBOX_ROWS_EXTRA = [
  {
    industryCode: 'code001',
    title: '이디야 커피',
    sub: '05.07(화) 09:00',
    amount: '3800',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code002',
    title: '카카오T',
    sub: '05.06(월) 22:10',
    amount: '9200',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code003',
    title: '저녁 회식',
    sub: '05.05(일) 19:00',
    amount: '124000',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code004',
    title: '세븐일레븐',
    sub: '05.04(토) 07:15',
    amount: '2100',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code005',
    title: 'SK주유소',
    sub: '05.03(금) 18:40',
    amount: '65000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code001',
    title: '투썸플레이스',
    sub: '05.02(목) 15:20',
    amount: '6500',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code003',
    title: '팀 회의 점심',
    sub: '05.01(수) 12:10',
    amount: '8900',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code002',
    title: '택시',
    sub: '04.30(화) 18:45',
    amount: '15000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code004',
    title: 'GS25',
    sub: '04.29(월) 08:05',
    amount: '4500',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code005',
    title: '현대오일뱅크',
    sub: '04.28(일) 17:30',
    amount: '72000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code001',
    title: '메가커피',
    sub: '04.27(토) 10:20',
    amount: '5200',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    industryCode: 'code003',
    title: '야근 식대',
    sub: '04.26(금) 21:15',
    amount: '15600',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
];

export const INBOX_SUB = {
  need: '영수증이 필요한 내역만 표시됩니다.',
  done: '처리 완료된 내역만 표시됩니다.',
  all: '전체 내역을 확인할 수 있습니다.',
};

const DONE_VISIBLE_COUNT = 7;

export function inboxRowsForMode(mode) {
  if (mode === 'need') return [...INBOX_ROWS_BASE];
  if (mode === 'done') return [...INBOX_ROWS_BASE, ...INBOX_ROWS_EXTRA.slice(0, DONE_VISIBLE_COUNT)];
  return [...INBOX_ROWS_BASE, ...INBOX_ROWS_EXTRA];
}

export function inboxTabCounts() {
  return {
    need: INBOX_ROWS_BASE.length,
    done: INBOX_ROWS_BASE.length + DONE_VISIBLE_COUNT,
    all: INBOX_ROWS_BASE.length + INBOX_ROWS_EXTRA.length,
  };
}

export function initialSelected(mode, rows) {
  return rows.map((row) => row.sel[mode] === 1);
}
