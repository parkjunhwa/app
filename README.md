# EVS 모바일 — HTML SPA

시안1 기준 본구현 프로토타입입니다.

## 실행

```bash
cd app
python3 -m http.server 8080
```

| URL | 설명 |
|-----|------|
| http://localhost:8080/login.html | 로그인 |
| http://localhost:8080/index.html#/home | 앱 (로그인 후, `sessionStorage` 키 `evs-auth`) |

## 라우트

| Hash | 화면 |
|------|------|
| `#/home` | 홈 |
| `#/expense/inbox` | 카드내역 Inbox (`?mode=need\|done\|all`) |
| `#/expense/receipt` | 영수증 등록 |
| `#/report` | 경비보고서 제출 |
| `#/approve` | 승인 대기 (`?tab=all\|urgent\|rejected`) |

## 디렉터리

```text
app/
├── index.html, login.html
├── css/
│   ├── tokens.css
│   ├── layout.css              # GNB, receipt-row, badge
│   ├── industry-code-colors.css  # exp001 색상 (사용처 색은 JS 생성)
│   ├── industry-icon-shapes.css
│   ├── pages.css
│   └── dx-overrides.css        # DevExtreme 톤·라이선스 숨김
├── js/
│   ├── main.js, router.js, shell.js
│   ├── dx-license-hide.js      # dx.all.js 직후 로드
│   ├── devextreme-init.js
│   ├── receipt-icon.js
│   ├── industry-icon-shapes.js
│   ├── data/
│   └── pages/
├── pages/
├── lib/                        # jQuery, DevExtreme 24.2.7, Lucide
└── assets/
```

## 스택

- HTML + ES modules (빌드 없음)
- DevExtreme 24.2.7 — 폼·입력
- Lucide — GNB·nav-header 등
- Pretendard GOV

## 목록 아이콘 (업종·경비 코드)

색상(CSS)과 SVG 형태(JS)를 분리합니다.

### API

```js
import { receiptIconHtml, expenseIconHtml, merchantIconHtml, merchantIconMeta } from './js/receipt-icon.js';

// 가맹점 4자리 업종코드 → 그룹 아이콘 HTML
merchantIconHtml('8001');          // 음식/식당 — rose 하트 아이콘
merchantIconHtml('1001');          // 숙박     — amber 침대 아이콘
merchantIconHtml('6201');          // 자동차   — orange 자동차 아이콘

// 그룹 메타 (label, shape, colorClass)
merchantIconMeta('3301');          // { label: '연료/주유', shape: 'fuel', colorClass: 'mc-fuel' }

// 레거시 code001~005 (기존 유지)
receiptIconHtml('code001');        // 카페/음료
expenseIconHtml('exp001');         // 식대
```

### 가맹점 업종코드 12개 그룹 (mc-\*)

4자리 코드는 `merchantCodeGroup()` 함수로 그룹을 결정하고,  
그룹별로 CSS 색상 클래스(`mc-*`)와 SVG shape가 자동 적용됩니다.  
같은 그룹에 속한 코드는 동일한 아이콘과 색상을 공유합니다.

| 그룹 키 | CSS 클래스 | 색상 | SVG shape | 코드 범위 | 대표 업종 |
|---------|-----------|------|-----------|----------|---------|
| `lodging` | `mc-lodging` | amber | `bed` | 1001–1021 | 호텔·콘도·여관 |
| `transport` | `mc-transport` | blue | `transit` | 1101–1199 | 항공·버스·택시·렌트카 |
| `leisure` | `mc-leisure` | emerald | `trophy` | 2001–2003, 2101–2199 | 골프·스키·볼링·헬스 |
| `culture` | `mc-culture` | violet | `music` | 2010–2029, 2201–2299 | 악기·영화관·골동품 |
| `home` | `mc-home` | teal | `house` | 3001–3299 | 가구·가전·주방용품 |
| `fuel` | `mc-fuel` | red | `fuel` | 3301–3399 | 주유소·LPG |
| `shopping` | `mc-shopping` | indigo | `bag` | 3401–4499 | 백화점·편의점·의류·잡화 |
| `education` | `mc-education` | yellow | `book` | 5001–5299 | 서적·학원·컴퓨터 |
| `auto` | `mc-auto` | orange | `car` | 6001–6299 | 자동차·정비·보험 |
| `health` | `mc-health` | cyan | `heart` | 7001–7199 | 병원·약국·미용 |
| `food` | `mc-food` | rose | `food` | 8001–8499 | 식당·주점·제과점 |
| `service` | `mc-service` | slate | `gear` | 9001–9999 | 건축·서비스·기타 |

### 파일 구조

| 파일 | 역할 |
|------|------|
| `js/data/industry-codes.js` | `MERCHANT_CODE_GROUPS`, `MERCHANT_CODE_RANGES`, `merchantCodeGroup()` |
| `js/data/merchant-codes.data.js` | 4자리 코드 전체 목록 (라벨) |
| `js/industry-icon-shapes.js` | SVG shape 마크업 (`ICON_SHAPES`) |
| `js/receipt-icon.js` | `merchantIconHtml()`, `merchantIconMeta()` 등 공개 API |
| `css/industry-code-colors.css` | `mc-*` 색상 클래스 (배경·전경) |

### 레거시 코드 (code001~005 / exp001~003)

기존 Inbox·홈 샘플 데이터가 사용하는 키. `normalizeIndustryCode` / `normalizeExpenseCode`로 변환됩니다.

| 키 | 그룹 | shape |
|----|------|-------|
| `code001` | 카페/음료 | `cafe` |
| `code002` | 교통 | `taxi` |
| `code003` | 음식 | `food` |
| `code004` | 유통/편의 | `store` |
| `code005` | 주유 | `fuel` |
| `exp001` | 식대 | `meal` |
| `exp002` | 교통비 | `transport` |
| `exp003` | 숙박비 | `lodging` |

## 화면별 동작

### 홈

- 칩 탭: **`summary-card`만** 갱신 (`HOME_SUMMARY_BY_TAB`)
- 퀵카드·최근 내역: 고정 (`HOME_QUICK`, `HOME_RECENT`)
- 퀵카드 색: `.home-screen` 전용 (`#1E5FCC` / `#0E8B4D` / `#5B4BD6`)

### 영수증 등록

- 첨부 이미지·파일 0건 → 해당 섹션 `hidden`
- 추가정보 미입력 → `#receiptAddInfo` `hidden`, 입력 시 표시·펼침
- FAB·캐러셀+: 사진 → 첨부 이미지, 문서 → 첨부 파일 (최대 8장)

### 승인 대기

- 배지: 긴급 solid `#F04438`, 반려 `#FF7A00`, 승인대기 파란 톤

### 보고서

- 메모 `dxForm` — 라이선스 배너는 `dx-license-hide.js` + `dx-overrides.css`로 숨김
