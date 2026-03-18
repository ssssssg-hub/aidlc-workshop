# Logical Components — Unit 2: Customer App

## 개요
Customer App은 클라이언트 SPA로, 서버 인프라 컴포넌트가 없음. 논리적 컴포넌트는 앱 내부 모듈 구조로 정의.

## 논리적 컴포넌트 구성

### 1. API Layer (`services/`)
- `apiFetch` — 공통 fetch 래퍼 (인증 헤더, 1회 재시도, 타임아웃, 에러 처리)
- `authApi` — 로그인 API
- `menuApi` — 카테고리/메뉴 조회
- `orderApi` — 주문 생성/조회
- `recommendApi` — AI 추천

### 2. State Layer (`store/`)
- `AuthContext` + `authReducer` — 인증 상태
- `CartContext` + `cartReducer` — 장바구니 + localStorage 동기화

### 3. Page Layer (`pages/`)
- 6개 페이지 (React.lazy 동적 임포트)

### 4. Component Layer (`components/`)
- 재사용 UI: CategoryTabs, MenuCard, CartItem, OrderCard, BottomNav
- 모달: MenuDetailModal, RecommendationModal
- 공통: LoadingSpinner, ErrorMessage, ErrorBoundary

### 5. Utility Layer (`utils/`)
- JWT 디코딩, 금액 포맷팅, localStorage 헬퍼

### 6. Type Layer (`types/`)
- API Response 타입, Client State 타입, Action 타입

## 데이터 흐름

```
[localStorage] <--동기화--> [CartContext/AuthContext]
                                    |
                                    v
                              [Pages/Components]
                                    |
                                    v
                              [API Layer (apiFetch)]
                                    |
                                    v
                           [Backend API (Unit 1)]
```
