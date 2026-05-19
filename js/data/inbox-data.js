/**
 * Inbox 카드내역 — merchantCode + 금액·일시·상태만 보관
 * 제목·부제는 merchant-display.js가 업종 마스터 기준으로 생성
 */
export const INBOX_ROWS_BASE = [
  {
    merchantCode: '8301',
    storeName: '스타벅스 강남점',
    dateTime: '05.11(토) 08:32',
    amount: '4500',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 1, done: 1, all: 1 },
  },
  {
    merchantCode: '1123',
    dateTime: '05.11(토) 21:03',
    amount: '18000',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 1, done: 1, all: 1 },
  },
  {
    merchantCode: '8001',
    storeName: '한일한식',
    dateTime: '05.10(금) 12:30',
    amount: '12000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 1, done: 0, all: 1 },
  },
  {
    merchantCode: '4010',
    storeName: 'CU 강남역점',
    dateTime: '05.09(목) 18:20',
    amount: '3200',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 1, done: 0, all: 0 },
  },
  {
    merchantCode: '3305',
    storeName: 'SK주유소',
    dateTime: '05.08(수) 09:15',
    amount: '50000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 1, done: 0, all: 0 },
  },
];

export const INBOX_ROWS_EXTRA = [
  {
    merchantCode: '8301',
    storeName: '이디야커피',
    dateTime: '05.07(화) 09:00',
    amount: '3800',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '1123',
    storeName: '카카오T',
    dateTime: '05.06(월) 22:10',
    amount: '9200',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '8001',
    dateTime: '05.05(일) 19:00',
    amount: '124000',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '4010',
    storeName: '세븐일레븐',
    dateTime: '05.04(토) 07:15',
    amount: '2100',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '3305',
    dateTime: '05.03(금) 18:40',
    amount: '65000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '8301',
    storeName: '투썸플레이스',
    dateTime: '05.02(목) 15:20',
    amount: '6500',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '8001',
    dateTime: '05.01(수) 12:10',
    amount: '8900',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '1123',
    dateTime: '04.30(화) 18:45',
    amount: '15000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '4010',
    storeName: 'GS25',
    dateTime: '04.29(월) 08:05',
    amount: '4500',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '3308',
    storeName: '현대오일뱅크',
    dateTime: '04.28(일) 17:30',
    amount: '72000',
    status: { need: 'need', done: 'done', all: 'need' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '8301',
    storeName: '메가커피',
    dateTime: '04.27(토) 10:20',
    amount: '5200',
    status: { need: 'need', done: 'done', all: 'done' },
    sel: { need: 0, done: 0, all: 0 },
  },
  {
    merchantCode: '8001',
    dateTime: '04.26(금) 21:15',
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
