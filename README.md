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
│   ├── layout.css                 # GNB, receipt-row, badge
│   ├── industry-code-colors.css   # mc-* 그룹 색상 (4자리 업종)
│   ├── industry-icon-shapes.css   # shape-* SVG 레이아웃
│   ├── pages.css
│   └── dx-overrides.css           # DevExtreme 톤·라이선스 숨김
├── js/
│   ├── main.js, router.js, shell.js
│   ├── dx-license-hide.js         # dx.all.js 직후 로드
│   ├── devextreme-init.js
│   ├── receipt-icon.js            # 아이콘 HTML API
│   ├── industry-icon-shapes.js    # ICON_SHAPES (SVG)
│   ├── data/
│   │   ├── industry-codes.js      # 코드 정의·정규화·가맹점 그룹
│   │   ├── merchant-codes.data.js # 4자리 업종코드 전체 목록
│   │   ├── home-data.js, inbox-data.js, report-data.js, …
│   └── pages/
├── pages/
├── lib/                           # jQuery, DevExtreme 24.2.7, Lucide
└── assets/
```

## 스택

- HTML + ES modules (빌드 없음)
- DevExtreme 24.2.7 — 폼·입력
- Lucide — GNB·nav-header 등
- Pretendard GOV

## 목록 아이콘 (4자리 가맹점 업종코드)

업종 아이콘은 **4자리 카드 가맹점 코드**만 사용합니다. (`code001`·`code006` 같은 별도 코드 체계 없음)

색상은 **CSS**(`mc-*`), SVG 형태는 **JS**(`industry-icon-shapes.js`)로 분리합니다.  
화면에서는 `merchantIconHtml(merchantCode)`만 호출합니다.

### 코드 체계

| 항목 | 형식 | 예시 |
|------|------|------|
| 가맹점 업종코드 | 4자리 숫자 | `1001`, `3305`, `8301` |
| 그룹 CSS 클래스 | `mc-{그룹}` | `mc-food`, `mc-transport` |
| 표시 문구 | `merchant-display.js` | `merchant-codes.data.js` 라벨 + 선택 `storeName` |

같은 `mc-*` 그룹은 동일 색·아이콘을 공유합니다.  
예: `6201`·`6210`·`6299` → `mc-auto` / `1001`·`1021` → `mc-lodging`

### HTML 클래스

```html
<span class="receipt-icon mc-food shape-food">…</span>
```

`variant: 'neutral'` → `receipt-icon--neutral` (회색)

### API

```js
import { merchantIconHtml, merchantIconMeta } from './js/receipt-icon.js';
import { merchantCodeGroup } from './js/data/industry-codes.js';

merchantIconHtml('8301');   // 제과점 — mc-food
merchantIconHtml('1123');   // 택시   — mc-transport
merchantIconHtml('1001');   // 숙박   — mc-lodging

merchantIconMeta('3301');  // { label, shape, colorClass }
merchantCodeGroup('9395');   // 'service'
```

### 가맹점 업종코드 12개 그룹 (`mc-*`)

`merchantCodeGroup()`이 4자리 코드를 그룹 키로 변환합니다.  
범위·그룹 정의는 `js/data/industry-codes.js`의 `MERCHANT_CODE_RANGES`를 수정합니다.

| 그룹 키 | CSS 클래스 | 톤 | SVG shape | 코드 범위 | 대표 업종 |
|---------|-----------|-----|-----------|----------|---------|
| `lodging` | `mc-lodging` | amber | `bed` | 1001–1021 | 호텔·콘도·여관 |
| `transport` | `mc-transport` | blue | `transit` | 1101–1199 | 항공·버스·택시·렌트카 |
| `leisure` | `mc-leisure` | emerald | `trophy` | 2001–2003, 2101–2199 | 골프·스키·볼링·헬스 |
| `culture` | `mc-culture` | violet | `music` | 2010–2029, 2201–2299 | 악기·영화관·골동품 |
| `home` | `mc-home` | teal | `house` | 3001–3299 | 가구·가전·주방용품 |
| `fuel` | `mc-fuel` | crimson | `fuel` | 3301–3399 | 주유소·LPG |
| `shopping` | `mc-shopping` | indigo | `bag` | 3401–4499 | 백화점·편의점·의류·잡화 |
| `education` | `mc-education` | yellow | `book` | 5001–5299 | 서적·학원·컴퓨터 |
| `auto` | `mc-auto` | orange | `car` | 6001–6299 | 자동차·정비·보험 |
| `health` | `mc-health` | cyan | `heart` | 7001–7199 | 병원·약국·미용 |
| `food` | `mc-food` | green | `food` | 8001–8499 | 식당·주점·제과점 |
| `service` | `mc-service` | slate | `gear` | 9001–9999 | 건축·서비스·기타 |

전체 4자리 코드·한글 라벨 목록: `js/data/merchant-codes.data.js`

### 관련 파일

| 파일 | 역할 |
|------|------|
| `js/data/industry-codes.js` | `MERCHANT_CODE_GROUPS`, `merchantCodeGroup()`, `merchantIconMeta()` |
| `js/data/merchant-codes.data.js` | 4자리 업종코드 마스터 (`MERCHANT_CODES`) — **유일한 업종 정의** |
| `js/merchant-display.js` | `merchantCodeLabel`, `merchantRowTitle`, `merchantRowSub` |
| `js/industry-icon-shapes.js` | `ICON_SHAPES` (12종 shape SVG) |
| `js/receipt-icon.js` | `merchantIconHtml()` |
| `css/industry-code-colors.css` | `mc-*` 배경·전경색 |
| `css/industry-icon-shapes.css` | `shape-*` 레이아웃 |

### 화면별 아이콘 사용

| 화면 | 데이터 필드 | API |
|------|------------|-----|
| 홈 최근 내역 | `merchantCode` | `merchantIconHtml()` |
| 카드 Inbox | `merchantCode` | `merchantIconHtml()` |
| 경비보고서 | `merchantCode` | `merchantIconHtml()` |
| 승인 대기 | `expenses[].merchantCode` | `merchantIconHtml()` |

## 화면별 동작

### 홈

- 칩 탭: **`summary-card`만** 갱신 (`HOME_SUMMARY_BY_TAB`)
- 퀵카드·최근 내역: 고정 (`HOME_QUICK`, `HOME_RECENT`)
- 최근 내역 아이콘: `merchantIconHtml(row.merchantCode)` (`8301` 제과점, `1123` 택시 등)
- 퀵카드 색: `.home-screen` 전용 (`#1E5FCC` / `#0E8B4D` / `#5B4BD6`)

### 영수증 등록

- 첨부 이미지·파일 0건 → 해당 섹션 `hidden`
- 추가정보 미입력 → `#receiptAddInfo` 접힘(헤더만), 입력 시 펼침·저장 버튼 표시
- FAB·캐러셀+: 사진 → 첨부 이미지, 문서 → 첨부 파일 (최대 8장)

### 승인 대기

- 배지: 긴급 solid `#F04438`, 반려 `#FF7A00`, 승인대기 파란 톤

### 카드 Inbox

- 행 아이콘: `merchantIconHtml(row.merchantCode)` — `mc-*` 그룹 색·shape

### 승인 대기

- 카드 내 경비 미리보기: `expenses[]` + `merchantIconHtml(merchantCode)`

### 보고서

- 경비 행: `merchantIconHtml` + `merchantRowTitle` / `merchantRowSub` (업종 라벨 자동)
- 메모 `dxForm` — 라이선스 배너는 `dx-license-hide.js` + `dx-overrides.css`로 숨김
