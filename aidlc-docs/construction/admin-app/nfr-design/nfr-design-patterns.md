# NFR Design Patterns — Unit 3: Admin App

## 1. 보안 패턴

### 1.1 인증 인터셉터 패턴 (SECURITY-08, SECURITY-12)
- Axios 인스턴스에 request interceptor 설정
- 모든 요청에 `Authorization: Bearer {token}` 자동 첨부
- response interceptor에서 401 감지 시 토큰 제거 + `/login` 리다이렉트
- 토큰 만료 타이머: 로그인 시 `exp` 클레임 기반 setTimeout 설정

### 1.2 라우트 보호 패턴 (SECURITY-08)
- `AuthGuard` 컴포넌트: localStorage 토큰 존재 + 만료 미도래 확인
- 미인증 시 `<Navigate to="/login" />` 반환
- 인증된 라우트를 `AuthGuard`로 래핑

### 1.3 입력 검증 패턴 (SECURITY-05)
- React Hook Form + Yup 스키마 기반 선언적 검증
- 모든 폼 필드에 타입/길이/형식 검증 적용
- 서버 검증 에러도 폼에 반영 (setError)

### 1.4 HTTP Security Headers (SECURITY-04)
- Vite 빌드 시 `index.html`에 meta 태그로 CSP 설정
- 프로덕션 배포 시 웹 서버(nginx) 설정으로 전체 헤더 적용:
  - `Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' blob:`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### 1.5 소스맵 비활성화 (SECURITY-09)
- Vite 프로덕션 빌드: `build.sourcemap: false`

### 1.6 의존성 보안 (SECURITY-10)
- `package-lock.json` 커밋
- `npm audit` CI 단계에 포함

## 2. 성능 패턴

### 2.1 코드 스플리팅
- React.lazy + Suspense로 라우트 기반 lazy loading
- 각 페이지 컴포넌트를 동적 import

```
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MenuManagementPage = lazy(() => import('./pages/MenuManagementPage'));
const TableSetupPage = lazy(() => import('./pages/TableSetupPage'));
```

### 2.2 SSE 이벤트 배치 처리
- SSE 이벤트 수신 시 Redux dispatch로 즉시 반영
- 다수 이벤트 동시 수신 시 React 18 자동 배칭 활용

### 2.3 메모이제이션
- 테이블 필터링 결과: `useMemo`
- 이벤트 핸들러: `useCallback`
- 불필요한 리렌더링 방지: `React.memo` (TableCard 등)

## 3. 안정성/에러 처리 패턴

### 3.1 글로벌 에러 바운더리 (SECURITY-15)
- App 최상위에 ErrorBoundary 컴포넌트 배치
- 미처리 에러 캐치 → 사용자 친화적 fallback UI 표시
- loglevel로 에러 로깅

### 3.2 API 에러 처리 패턴
- Axios response interceptor에서 공통 에러 처리
- 네트워크 에러 / 서버 에러 / 비즈니스 에러 구분
- Redux slice에서 에러 상태 관리 → Snackbar 표시

### 3.3 낙관적 업데이트 패턴
- 주문 상태 변경 시: 즉시 Redux state 업데이트 → API 호출 → 실패 시 이전 상태 복원
- 메뉴 순서 변경 시: 즉시 로컬 swap → API 호출 → 실패 시 롤백

### 3.4 구조화된 로깅 (SECURITY-03 대체)
- loglevel 라이브러리 설정:
  - 개발: `debug` 레벨
  - 프로덕션: `warn` 레벨
- 민감 정보 (토큰, 비밀번호) 로깅 금지
