# Code Generation Plan — Unit 3: Admin App

## Unit Context
- **유형**: React SPA (TypeScript, 데스크톱 웹)
- **기술**: React 18, Redux Toolkit, MUI v5, Vite, Axios, loglevel
- **코드 위치**: `frontend-admin/` (workspace root)
- **의존**: Unit 1 Backend API (REST + SSE)
- **스토리**: 15개 (Epic 7~10)

---

## Code Generation Steps

### Project Setup
- [x] Step 1: 프로젝트 초기화 (Vite + React + TypeScript) 및 의존성 설치
- [x] Step 2: 프로젝트 설정 파일 (vite.config.ts, tsconfig.json, .eslintrc.cjs)

### Foundation Layer
- [x] Step 3: TypeScript 타입 정의 (`types/index.ts`)
- [x] Step 4: 유틸리티 — logger 설정 (`utils/logger.ts`)
- [x] Step 5: API 서비스 기반 — Axios 인스턴스 + 인터셉터 (`services/api.ts`)
- [x] Step 6: Redux Store 설정 (`app/store.ts`)

### Redux Slices
- [x] Step 7: Auth Slice (`features/auth/authSlice.ts`)
- [x] Step 8: Orders Slice (`features/orders/ordersSlice.ts`)
- [x] Step 9: Tables Slice (`features/tables/tablesSlice.ts`)
- [x] Step 10: Menus Slice (`features/menus/menusSlice.ts`)
- [x] Step 11: Notification Slice (`features/notification/notificationSlice.ts`)

### API Services
- [x] Step 12: Auth Service (`services/authService.ts`)
- [x] Step 13: Order Service (`services/orderService.ts`)
- [x] Step 14: Table Service (`services/tableService.ts`)
- [x] Step 15: Menu Service + Image Service (`services/menuService.ts`, `services/imageService.ts`)
- [x] Step 16: SSE Service (`services/sseService.ts`)

### Custom Hooks
- [x] Step 17: useAuth, useSse 훅 (`hooks/useAuth.ts`, `hooks/useSse.ts`)

### Common Components
- [x] Step 18: ErrorBoundary, AuthGuard, NotificationSnackbar, AppLayout (`components/`)

### Pages — Login
- [x] Step 19: LoginPage + LoginForm (`pages/LoginPage.tsx`) — US-A01-1, US-A01-2

### Pages — Dashboard
- [x] Step 20: DashboardPage + TableGrid + TableCard (`pages/DashboardPage.tsx`) — US-A02-1, US-A02-2, US-A02-3, US-A02-4
- [x] Step 21: OrderDetailModal (`pages/dashboard/OrderDetailModal.tsx`) — US-A02-3, US-A02-4, US-A03-2
- [x] Step 22: PaymentCompleteModal (`pages/dashboard/PaymentCompleteModal.tsx`) — US-A03-3
- [x] Step 23: OrderHistoryModal (`pages/dashboard/OrderHistoryModal.tsx`) — US-A03-4

### Pages — Menu Management
- [x] Step 24: MenuManagementPage + MenuList + MenuFormModal (`pages/MenuManagementPage.tsx`) — US-A04-1~5

### Pages — Table Setup
- [x] Step 25: TableSetupPage (`pages/TableSetupPage.tsx`) — US-A03-1

### App Entry
- [x] Step 26: App.tsx (라우팅 + AuthGuard + Suspense) 및 main.tsx

### Unit Tests
- [x] Step 27: Redux Slice 단위 테스트 (authSlice, ordersSlice, tablesSlice, menusSlice)
- [x] Step 28: Service 단위 테스트 (authService, orderService, tableService, menuService)
- [x] Step 29: Component 단위 테스트 (LoginPage, DashboardPage, MenuManagementPage, TableSetupPage)

### Deployment
- [x] Step 30: Dockerfile (multi-stage build)
- [x] Step 31: nginx.conf
- [x] Step 32: Docker Compose 서비스 추가 (docker-compose.yml 부분)

### Documentation
- [x] Step 33: Code Generation Summary (aidlc-docs)

---

## Story Traceability

| Step | Stories |
|---|---|
| Step 19 | US-A01-1, US-A01-2 |
| Step 20 | US-A02-1, US-A02-2 |
| Step 21 | US-A02-3, US-A02-4, US-A03-2 |
| Step 22 | US-A03-3 |
| Step 23 | US-A03-4 |
| Step 24 | US-A04-1, US-A04-2, US-A04-3, US-A04-4, US-A04-5 |
| Step 25 | US-A03-1 |
