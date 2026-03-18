# Code Summary — Unit 2: Customer App

## 생성된 파일 목록

### 설정 파일 (6)
- `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`
- `index.html`, `Dockerfile`, `nginx.conf`

### 타입 (1)
- `src/types/index.ts` — 전체 TypeScript 인터페이스/타입

### 유틸리티 (3)
- `src/utils/jwt.ts`, `src/utils/format.ts`, `src/utils/storage.ts`

### API Layer (5)
- `src/services/apiFetch.ts` — 공통 래퍼 (인증, 재시도, 타임아웃)
- `src/services/authApi.ts`, `menuApi.ts`, `orderApi.ts`, `recommendApi.ts`

### State Management (2)
- `src/store/AuthContext.tsx`, `src/store/CartContext.tsx`

### 컴포넌트 (10 + CSS)
- `ErrorBoundary`, `LoadingSpinner`, `ErrorMessage`, `BottomNav`
- `CategoryTabs`, `MenuCard`, `MenuDetailModal`, `RecommendationModal`
- `CartItem`, `CartSummary`, `OrderCard`

### 페이지 (6 + CSS)
- `SetupPage`, `MenuPage`, `CartPage`, `OrderConfirmPage`, `OrderSuccessPage`, `OrderHistoryPage`

### 엔트리 (3)
- `App.tsx`, `main.tsx`, `App.module.css`, `vite-env.d.ts`

### 단위 테스트 (13)
- utils: `jwt.test.ts`, `storage.test.ts`
- services: `apiFetch.test.ts`
- store: `AuthContext.test.tsx`, `CartContext.test.tsx`
- components: `BottomNav.test.tsx`, `MenuCard.test.tsx`, `CartItem.test.tsx`
- pages: `SetupPage.test.tsx`, `MenuPage.test.tsx`, `CartPage.test.tsx`, `OrderConfirmPage.test.tsx`, `OrderHistoryPage.test.tsx`

## 스토리 매핑

| Story | 구현 파일 |
|---|---|
| US-C01-1, US-C01-2 | SetupPage, AuthContext, authApi |
| US-C02-1, US-C02-2 | MenuPage, CategoryTabs, MenuCard, MenuDetailModal, menuApi |
| US-C03-1~6 | CartPage, CartItem, CartSummary, CartContext |
| US-C04-1~4 | OrderConfirmPage, OrderSuccessPage, orderApi |
| US-C05-1~2 | RecommendationModal, recommendApi |
| US-C06-1~2 | OrderHistoryPage, OrderCard, orderApi |
