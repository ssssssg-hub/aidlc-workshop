# Logical Components — Unit 3: Admin App

## 컴포넌트 구조

```
frontend-admin/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # 라우팅 + ErrorBoundary + Suspense
│   │   └── store.ts                 # Redux store 설정
│   ├── components/
│   │   ├── AuthGuard.tsx            # 인증 라우트 보호
│   │   ├── AppLayout.tsx            # 공통 레이아웃 (사이드바 + 헤더)
│   │   ├── ErrorBoundary.tsx        # 글로벌 에러 바운더리
│   │   └── NotificationSnackbar.tsx # 전역 알림
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── MenuManagementPage.tsx
│   │   └── TableSetupPage.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.ts         # 인증 상태 (token, user)
│   │   ├── orders/
│   │   │   └── ordersSlice.ts       # 주문 상태 (테이블별 주문, SSE 이벤트)
│   │   ├── tables/
│   │   │   └── tablesSlice.ts       # 테이블 상태
│   │   ├── menus/
│   │   │   └── menusSlice.ts        # 메뉴 상태
│   │   └── notification/
│   │       └── notificationSlice.ts # 알림 상태
│   ├── services/
│   │   ├── api.ts                   # Axios 인스턴스 (인터셉터 설정)
│   │   ├── authService.ts           # 인증 API 호출
│   │   ├── orderService.ts          # 주문 API 호출
│   │   ├── tableService.ts          # 테이블 API 호출
│   │   ├── menuService.ts           # 메뉴 API 호출
│   │   ├── imageService.ts          # 이미지 업로드 API
│   │   └── sseService.ts            # SSE 연결 관리
│   ├── hooks/
│   │   ├── useAuth.ts               # 인증 관련 커스텀 훅
│   │   └── useSse.ts                # SSE 연결 커스텀 훅
│   ├── types/
│   │   └── index.ts                 # TypeScript 타입 정의
│   ├── utils/
│   │   └── logger.ts                # loglevel 설정
│   └── main.tsx                     # 엔트리 포인트
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .eslintrc.cjs
```

## Redux Store 구조

```typescript
{
  auth: {
    token: string | null;
    storeId: string | null;
    isAuthenticated: boolean;
  },
  orders: {
    byTableId: Record<number, Order[]>;
    loading: boolean;
    error: string | null;
  },
  tables: {
    list: TableStatus[];
    loading: boolean;
    error: string | null;
  },
  menus: {
    list: Menu[];
    categories: Category[];
    selectedCategory: number | null;
    loading: boolean;
    error: string | null;
  },
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }
}
```

## 서비스 레이어 — API 매핑

| Service | Method | Backend Endpoint |
|---|---|---|
| authService | login | POST /api/admin/auth/login |
| orderService | getOrdersByTable | GET /api/admin/orders?tableId={id} |
| orderService | updateOrderStatus | PUT /api/admin/orders/{id}/status |
| orderService | deleteOrder | DELETE /api/admin/orders/{id} |
| tableService | getTables | GET /api/admin/tables |
| tableService | setupTable | POST /api/admin/tables |
| tableService | completePayment | POST /api/admin/tables/{id}/payment-complete |
| tableService | getOrderHistory | GET /api/admin/tables/{id}/history?date={date} |
| menuService | getCategories | GET /api/categories |
| menuService | getMenusByCategory | GET /api/menus?category={id} |
| menuService | createMenu | POST /api/admin/menus |
| menuService | updateMenu | PUT /api/admin/menus/{id} |
| menuService | deleteMenu | DELETE /api/admin/menus/{id} |
| menuService | updateMenuOrder | PUT /api/admin/menus/order |
| imageService | uploadImage | POST /api/admin/images |
| sseService | connect | GET /api/admin/orders/stream |
