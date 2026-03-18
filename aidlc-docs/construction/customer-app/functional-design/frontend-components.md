# Frontend Components — Unit 2: Customer App

## 기술 결정사항
- **라우팅**: React Router + 하단 탭 네비게이션
- **상태 관리**: React Context + useReducer
- **API 호출**: fetch API
- **스타일링**: CSS Modules

## 페이지/컴포넌트 계층

```
App
├── AuthProvider (Context)
├── CartProvider (Context)
├── Router
│   ├── /setup → SetupPage
│   ├── /menu → MenuPage
│   │   ├── CategoryTabs
│   │   ├── MenuCard (반복)
│   │   ├── MenuDetailModal
│   │   └── RecommendationModal
│   ├── /cart → CartPage
│   │   ├── CartItem (반복)
│   │   └── CartSummary
│   ├── /order-confirm → OrderConfirmPage
│   ├── /order-success → OrderSuccessPage
│   └── /orders → OrderHistoryPage
│       └── OrderCard (반복)
└── BottomNav (메뉴 | 장바구니 | 주문내역)
```

## 컴포넌트 상세

### App
- **책임**: 라우터, Context Provider 래핑, 자동 로그인 판별
- **State**: 없음 (Context에 위임)

### AuthProvider
- **책임**: 인증 상태 관리, 자동 로그인, 토큰 저장
- **Context State**:
  - `token: string | null`
  - `sessionId: string | null`
  - `storeId: string | null`
  - `tableId: number | null`
  - `isAuthenticated: boolean`
- **Actions**: `login(storeIdentifier, tableNumber, password)`, `logout()`
- **로직**: 앱 시작 시 localStorage에서 토큰 확인 → 유효하면 자동 인증, 만료/없으면 SetupPage로 이동

### CartProvider
- **책임**: 장바구니 상태 관리, localStorage 동기화
- **Context State**:
  - `items: CartItem[]`
  - `totalAmount: number`
- **Actions**: `addItem(menu)`, `removeItem(menuId)`, `updateQuantity(menuId, quantity)`, `clearCart()`
- **로직**: 모든 변경 시 localStorage에 자동 저장, 앱 시작 시 localStorage에서 복원

### SetupPage
- **Props**: 없음
- **Local State**: `storeIdentifier`, `tableNumber`, `password`, `error`, `loading`
- **동작**: 입력 → 로그인 API 호출 → 성공 시 /menu로 이동
- **API**: `POST /api/table/auth/login`

### MenuPage
- **Props**: 없음
- **Local State**: `categories`, `menus`, `selectedCategory`, `selectedMenu`, `showRecommendation`, `loading`
- **동작**: 카테고리 로드 → 메뉴 목록 표시 → 카테고리 탭 전환 → 메뉴 카드 클릭 시 상세 모달
- **API**: `GET /api/categories`, `GET /api/menus?category={id}`

### CategoryTabs
- **Props**: `categories: Category[]`, `selectedId: number`, `onSelect: (id) => void`
- **동작**: 카테고리 탭 렌더링, 선택 시 콜백

### MenuCard
- **Props**: `menu: Menu`, `onDetail: (menu) => void`, `onAddToCart: (menu) => void`
- **동작**: 메뉴명, 가격, 이미지 표시, 클릭 시 상세/장바구니 추가

### MenuDetailModal
- **Props**: `menu: Menu | null`, `onClose: () => void`, `onAddToCart: (menu) => void`
- **동작**: 메뉴 상세 정보(이름, 가격, 설명, 이미지) 표시, 장바구니 추가 버튼

### RecommendationModal
- **Props**: `onClose: () => void`, `onAddToCart: (items: CartItem[]) => void`
- **Local State**: `partySize`, `diningType`, `recommendations`, `loading`, `step` (input | result)
- **동작**: 인원수/식사유형 입력 → API 호출 → 로딩 스피너 → 결과 2~3개 표시 → 선택 시 장바구니 일괄 추가
- **API**: `POST /api/recommendations`

### CartPage
- **Props**: 없음 (CartContext 사용)
- **동작**: 장바구니 항목 목록, 수량 조절, 삭제, 비우기, 총 금액 표시, 주문하기 버튼 → /order-confirm

### CartItem
- **Props**: `item: CartItemType`, `onUpdateQuantity: (menuId, qty) => void`, `onRemove: (menuId) => void`
- **동작**: 메뉴명, 단가, 수량(+/-), 소계, 삭제 버튼

### CartSummary
- **Props**: `totalAmount: number`, `itemCount: number`
- **동작**: 총 금액, 항목 수 표시

### OrderConfirmPage
- **Props**: 없음 (CartContext 사용)
- **Local State**: `loading`, `error`
- **동작**: 장바구니 내역 최종 확인 → 주문 확정 버튼 → API 호출 → 성공 시 /order-success, 실패 시 에러 표시
- **API**: `POST /api/orders`

### OrderSuccessPage
- **Props**: 없음 (URL params로 orderNumber 수신)
- **Local State**: `countdown`
- **동작**: 주문 번호 표시, 5초 카운트다운 후 /menu 자동 이동

### OrderHistoryPage
- **Props**: 없음
- **Local State**: `orders`, `loading`
- **동작**: 현재 세션 주문 목록 조회, 시간순 정렬
- **API**: `GET /api/orders?sessionId={id}`

### OrderCard
- **Props**: `order: Order`
- **동작**: 주문 번호, 시각, 메뉴/수량, 금액, 상태(대기중/준비중/완료) 표시

### BottomNav
- **Props**: `cartItemCount: number`
- **동작**: 메뉴/장바구니/주문내역 탭, 장바구니 탭에 아이템 수 뱃지 표시
