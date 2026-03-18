# Frontend Components — Unit 3: Admin App

## 기술 결정사항
- **UI 라이브러리**: MUI (Material UI)
- **상태 관리**: Redux Toolkit
- **라우팅**: React Router v6
- **HTTP Client**: Axios
- **SSE**: EventSource API (네이티브)

---

## 라우팅 구조

| Path | Component | 인증 필요 | 설명 |
|---|---|---|---|
| `/login` | LoginPage | No | 관리자 로그인 |
| `/dashboard` | DashboardPage | Yes | 실시간 주문 모니터링 |
| `/menus` | MenuManagementPage | Yes | 메뉴 CRUD |
| `/tables/setup` | TableSetupPage | Yes | 테이블 초기 설정 |

---

## 컴포넌트 계층 구조

```
App
├── AuthGuard (인증 라우트 보호)
│   ├── AppLayout (공통 레이아웃: 사이드바 + 헤더)
│   │   ├── DashboardPage
│   │   │   ├── TableGrid
│   │   │   │   └── TableCard (반복)
│   │   │   │       ├── OrderPreviewList
│   │   │   │       └── TableActionButtons
│   │   │   ├── OrderDetailModal
│   │   │   ├── PaymentCompleteModal
│   │   │   └── OrderHistoryModal
│   │   ├── MenuManagementPage
│   │   │   ├── MenuCategoryTabs
│   │   │   ├── MenuList
│   │   │   │   └── MenuListItem (반복)
│   │   │   └── MenuFormModal (등록/수정 공용)
│   │   └── TableSetupPage
│   │       └── TableSetupForm
├── LoginPage
│   └── LoginForm
└── NotificationSnackbar (전역 알림)
```

---

## 페이지별 상세 설계

### 1. LoginPage

**스토리**: US-A01-1, US-A01-2

**State**:
- `storeId: string` — 매장 식별자
- `username: string` — 사용자명
- `password: string` — 비밀번호
- `isLoading: boolean` — 로그인 요청 중
- `error: string | null` — 에러 메시지

**API 연동**:
- `POST /api/admin/auth/login` → 성공 시 JWT 토큰을 localStorage에 저장, `/dashboard`로 이동

**폼 검증**:
- storeId: 필수
- username: 필수
- password: 필수

---

### 2. DashboardPage

**스토리**: US-A02-1, US-A02-2, US-A02-3, US-A02-4, US-A03-2, US-A03-3, US-A03-4

**State (Redux)**:
- `tables: TableStatus[]` — 테이블 목록 + 주문 현황
- `sseConnected: boolean` — SSE 연결 상태
- `filterTableId: number | null` — 테이블 필터

**API 연동**:
- `GET /api/admin/tables` → 초기 테이블 상태 로드
- `GET /api/admin/orders?tableId={id}` → 테이블별 주문 조회
- `GET /api/admin/orders/stream` → SSE 실시간 이벤트 수신
- `PUT /api/admin/orders/{id}/status` → 주문 상태 변경
- `DELETE /api/admin/orders/{id}` → 주문 삭제
- `POST /api/admin/tables/{id}/payment-complete` → 결제 완료
- `GET /api/admin/tables/{id}/history?date={date}` → 과거 내역 조회

**SSE 이벤트 처리**:
| Event | 처리 |
|---|---|
| NEW_ORDER | 해당 테이블 카드에 주문 추가, 시각적 강조 |
| ORDER_STATUS_CHANGED | 해당 주문 상태 업데이트 |
| ORDER_DELETED | 해당 주문 제거, 총 주문액 재계산 |
| PAYMENT_COMPLETED | 해당 테이블 리셋 |

#### TableCard
**Props**:
- `table: TableStatus` — 테이블 정보 (번호, 총 주문액, 최신 주문 5개)
- `onOrderClick: (orderId) => void`
- `onPaymentComplete: (tableId) => void`
- `onViewHistory: (tableId) => void`

**표시 정보**:
- 테이블 번호
- 총 주문액
- 최신 주문 5개 미리보기 (주문번호, 금액, 상태)
- 신규 주문 시 카드 배경색 변경 + 애니메이션 (2초간)

#### OrderDetailModal
**Props**:
- `open: boolean`
- `orderId: number | null`
- `onClose: () => void`

**기능**:
- 주문 전체 메뉴 목록 상세 표시
- 주문 상태 변경 (Select: PENDING/PREPARING/COMPLETED)
- 주문 삭제 버튼 (확인 Dialog 포함)

#### PaymentCompleteModal
**Props**:
- `open: boolean`
- `tableId: number | null`
- `totalAmount: number`
- `onConfirm: () => void`
- `onClose: () => void`

**기능**:
- 해당 테이블 총 주문 금액 표시
- 결제 완료 확정 버튼
- 확정 시 API 호출 → 성공 시 테이블 리셋

#### OrderHistoryModal
**Props**:
- `open: boolean`
- `tableId: number | null`
- `onClose: () => void`

**State**:
- `history: OrderHistory[]`
- `dateFilter: string | null`

**기능**:
- 과거 주문 목록 (시간 역순)
- 날짜 필터 (MUI DatePicker)
- 각 주문: 주문 번호, 시각, 메뉴 목록, 총 금액, 이용 완료 시각

---

### 3. MenuManagementPage

**스토리**: US-A04-1, US-A04-2, US-A04-3, US-A04-4, US-A04-5

**State (Redux)**:
- `menus: Menu[]` — 메뉴 목록
- `categories: Category[]` — 카테고리 목록
- `selectedCategory: number | null` — 선택된 카테고리

**API 연동**:
- `GET /api/categories` → 카테고리 목록
- `GET /api/menus?category={id}` → 카테고리별 메뉴 조회
- `POST /api/admin/menus` → 메뉴 등록
- `PUT /api/admin/menus/{id}` → 메뉴 수정
- `DELETE /api/admin/menus/{id}` → 메뉴 삭제
- `PUT /api/admin/menus/order` → 메뉴 순서 변경
- `POST /api/admin/images` → 이미지 업로드
- `GET /api/images/{filename}` → 이미지 표시

#### MenuFormModal (등록/수정 공용)
**Props**:
- `open: boolean`
- `menu: Menu | null` — null이면 등록, 값이 있으면 수정
- `categories: Category[]`
- `onSubmit: (data) => void`
- `onClose: () => void`

**폼 필드 및 검증**:
| 필드 | 타입 | 검증 |
|---|---|---|
| name | TextField | 필수 |
| price | NumberField | 필수, 100~1,000,000 |
| description | TextField (multiline) | 선택 |
| categoryId | Select | 필수 |
| image | FileUpload | 선택, jpg/jpeg/png/gif/webp, 최대 5MB |

#### MenuListItem
**Props**:
- `menu: Menu`
- `onEdit: (menu) => void`
- `onDelete: (menuId) => void`
- `onMoveUp: (menuId) => void`
- `onMoveDown: (menuId) => void`
- `isFirst: boolean`
- `isLast: boolean`

**기능**:
- 메뉴 정보 표시 (이름, 가격, 카테고리, 이미지 썸네일)
- 수정/삭제 버튼
- 위/아래 화살표 버튼 (순서 조정, 첫 번째/마지막 항목은 해당 방향 비활성화)

---

### 4. TableSetupPage

**스토리**: US-A03-1

**State**:
- `tableNumber: number | ''`
- `password: string`
- `isLoading: boolean`
- `result: { success: boolean; message: string } | null`

**API 연동**:
- `POST /api/admin/tables` → 테이블 설정

**폼 검증**:
- tableNumber: 필수, 양의 정수
- password: 필수

---

## 공통 컴포넌트

### AuthGuard
- JWT 토큰 존재 여부 확인 (localStorage)
- 토큰 만료 확인 (디코딩 후 exp 체크)
- 미인증 시 `/login`으로 리다이렉트
- 16시간 만료 시 자동 로그아웃

### AppLayout
- 좌측 사이드바: 대시보드, 메뉴 관리, 테이블 설정 네비게이션
- 상단 헤더: 매장명, 로그아웃 버튼
- 메인 콘텐츠 영역

### NotificationSnackbar
- Redux state 기반 전역 알림
- 성공/실패/정보 타입별 색상 구분
- 자동 닫힘 (3초)
