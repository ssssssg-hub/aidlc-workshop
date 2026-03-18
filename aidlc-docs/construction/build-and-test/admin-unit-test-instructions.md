# Unit Test Execution — Unit 3: Admin App

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
cd frontend-admin
npm run test:run
```

### 2. Watch Mode (개발 중)
```bash
npm run test
```

### 3. Coverage Report
```bash
npx vitest run --coverage
```

## Test Suite 구성

| Test File | 대상 | 테스트 항목 |
|---|---|---|
| `slices/authSlice.test.ts` | Auth Redux Slice | loginSuccess, logout |
| `slices/ordersSlice.test.ts` | Orders Redux Slice | newOrderReceived, clearHighlight, orderStatusChanged, orderDeleted, tableReset, setAllOrders |
| `slices/menusSlice.test.ts` | Menus Redux Slice | setMenus, setCategories, addMenu, updateMenu, removeMenu, reorderMenus |
| `slices/tablesSlice.test.ts` | Tables Redux Slice | setTables, setLoading, setError |
| `services/services.test.ts` | API Services | authService.login, orderService CRUD, tableService CRUD, menuService CRUD |
| `pages/LoginPage.test.tsx` | LoginPage Component | 폼 렌더링, 빈 필드 에러 표시 |

## Expected Results
- **총 테스트**: 약 20개
- **통과**: 전체 통과
- **실패**: 0
- **Test Report**: 터미널 출력

## Fix Failing Tests
1. 터미널 출력에서 실패한 테스트 확인
2. 에러 메시지와 스택 트레이스 분석
3. 해당 소스 코드 또는 테스트 코드 수정
4. `npm run test:run`으로 재실행
