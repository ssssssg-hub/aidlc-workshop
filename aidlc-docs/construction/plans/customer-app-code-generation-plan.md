# Code Generation Plan — Unit 2: Customer App

## Unit Context
- **유형**: React SPA (모바일 웹)
- **기술**: React 18, TypeScript (strict), Vite, React Router v6, CSS Modules
- **상태 관리**: React Context + useReducer
- **API 호출**: fetch API (공통 래퍼)
- **의존**: Unit 1 Backend API (REST)
- **배포**: Docker (nginx:alpine)

## 담당 스토리
- US-C01-1, US-C01-2 (테이블 설정/자동 로그인 UI)
- US-C02-1, US-C02-2 (메뉴 조회 UI)
- US-C03-1~6 (장바구니 관리)
- US-C04-1~4 (주문 생성/추가 주문 UI)
- US-C05-1~2 (AI 추천 UI)
- US-C06-1~2 (주문 내역 조회 UI)

## 코드 위치
- **Application Code**: `frontend-customer/` (workspace root)
- **Documentation**: `aidlc-docs/construction/customer-app/code/`

---

## 실행 계획

### Step 1: 프로젝트 구조 및 설정 파일
- [x] Vite + React + TypeScript 프로젝트 구조 생성
- [x] `package.json`, `tsconfig.json`, `vite.config.ts`
- [x] ESLint, Prettier 설정
- [x] Dockerfile (멀티스테이지: node:20-alpine → nginx:alpine)
- [x] `nginx.conf` (SPA 라우팅, API 프록시, Security 헤더, gzip)
- [x] `index.html`

### Step 2: 타입 정의 (`types/`)
- [x] `types/index.ts` — 모든 TypeScript 인터페이스/타입 (Category, Menu, Order, CartItem, AuthState, CartState, Action 타입 등)

### Step 3: 유틸리티 (`utils/`)
- [x] `utils/jwt.ts` — JWT exp 디코딩 (만료 확인)
- [x] `utils/format.ts` — 금액 포맷팅
- [x] `utils/storage.ts` — localStorage 헬퍼 (get/set/remove, JSON.parse 안전 처리)

### Step 4: API Layer (`services/`)
- [x] `services/apiFetch.ts` — 공통 fetch 래퍼 (인증 헤더, 1회 재시도, 30초 타임아웃, 401 처리)
- [x] `services/authApi.ts` — 테이블 로그인
- [x] `services/menuApi.ts` — 카테고리/메뉴 조회
- [x] `services/orderApi.ts` — 주문 생성/조회
- [x] `services/recommendApi.ts` — AI 추천

### Step 5: State Management (`store/`)
- [x] `store/AuthContext.tsx` — AuthProvider, authReducer, useAuth hook
- [x] `store/CartContext.tsx` — CartProvider, cartReducer, useCart hook, localStorage 동기화

### Step 6: 공통 컴포넌트 (`components/`)
- [x] `components/ErrorBoundary.tsx` — React Error Boundary
- [x] `components/LoadingSpinner.tsx` — 로딩 스피너
- [x] `components/ErrorMessage.tsx` — 에러 메시지 + 재시도 버튼
- [x] `components/BottomNav.tsx` — 하단 탭 네비게이션 (메뉴|장바구니|주문내역)
- [x] 각 컴포넌트 CSS Module

### Step 7: 메뉴 관련 컴포넌트 (Epic 2, 5)
- [x] `components/CategoryTabs.tsx` — 카테고리 탭
- [x] `components/MenuCard.tsx` — 메뉴 카드 (React.memo)
- [x] `components/MenuDetailModal.tsx` — 메뉴 상세 모달
- [x] `components/RecommendationModal.tsx` — AI 추천 모달 (인원수/식사유형 입력, 로딩, 결과)
- [x] 각 컴포넌트 CSS Module

### Step 8: 장바구니 컴포넌트 (Epic 3)
- [x] `components/CartItem.tsx` — 장바구니 항목 (React.memo)
- [x] `components/CartSummary.tsx` — 총 금액/항목 수
- [x] 각 컴포넌트 CSS Module

### Step 9: 주문 컴포넌트 (Epic 4, 6)
- [x] `components/OrderCard.tsx` — 주문 카드 (React.memo)
- [x] CSS Module

### Step 10: 페이지 컴포넌트 (Epic 1~6)
- [x] `pages/SetupPage.tsx` — 테이블 초기 설정 (US-C01-1, US-C01-2)
- [x] `pages/MenuPage.tsx` — 메뉴 목록/상세/추천 (US-C02-1, US-C02-2, US-C05-1, US-C05-2)
- [x] `pages/CartPage.tsx` — 장바구니 (US-C03-1~6)
- [x] `pages/OrderConfirmPage.tsx` — 주문 확인 (US-C04-1)
- [x] `pages/OrderSuccessPage.tsx` — 주문 성공 (US-C04-2, US-C04-3, US-C04-4)
- [x] `pages/OrderHistoryPage.tsx` — 주문 내역 (US-C06-1, US-C06-2)
- [x] 각 페이지 CSS Module

### Step 11: App 엔트리 포인트
- [x] `App.tsx` — Router, Context Provider, ErrorBoundary, React.lazy 페이지 임포트
- [x] `main.tsx` — ReactDOM 렌더링
- [x] `App.module.css` — 글로벌 레이아웃

### Step 12: 단위 테스트
- [x] `__tests__/utils/jwt.test.ts`
- [x] `__tests__/utils/storage.test.ts`
- [x] `__tests__/services/apiFetch.test.ts`
- [x] `__tests__/store/AuthContext.test.tsx`
- [x] `__tests__/store/CartContext.test.tsx`
- [x] `__tests__/components/BottomNav.test.tsx`
- [x] `__tests__/components/MenuCard.test.tsx`
- [x] `__tests__/components/CartItem.test.tsx`
- [x] `__tests__/pages/SetupPage.test.tsx`
- [x] `__tests__/pages/MenuPage.test.tsx`
- [x] `__tests__/pages/CartPage.test.tsx`
- [x] `__tests__/pages/OrderConfirmPage.test.tsx`
- [x] `__tests__/pages/OrderHistoryPage.test.tsx`

### Step 13: 코드 생성 요약 문서
- [x] `aidlc-docs/construction/customer-app/code/code-summary.md` — 생성된 파일 목록, 스토리 매핑
