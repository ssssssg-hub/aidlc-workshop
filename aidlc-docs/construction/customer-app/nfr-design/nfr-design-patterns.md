# NFR Design Patterns — Unit 2: Customer App

## 1. 에러 처리 및 복원력 패턴

### 1.1 API 호출 래퍼 (자동 1회 재시도)
- 모든 API 호출을 공통 `apiFetch` 함수로 래핑
- 네트워크 에러 또는 5xx 응답 시 자동 1회 재시도
- 재시도 실패 시 에러 메시지 + 수동 재시도 버튼
- 401 응답은 재시도 없이 즉시 로그아웃
- 4xx (401 제외)는 재시도 없이 에러 메시지 표시

### 1.2 Error Boundary
- 최상위 App에 React Error Boundary 적용
- 폴백 UI: "문제가 발생했습니다. 새로고침해 주세요." + 새로고침 버튼

### 1.3 AbortController 타임아웃
- 모든 fetch 요청에 30초 타임아웃 적용

## 2. 성능 패턴

### 2.1 코드 스플리팅 (페이지 단위 Lazy Loading)
- React.lazy + Suspense로 페이지 컴포넌트 동적 임포트
- 대상: SetupPage, MenuPage, CartPage, OrderConfirmPage, OrderSuccessPage, OrderHistoryPage
- 초기 번들: App, Router, Context Provider, BottomNav만 포함

### 2.2 이미지 Lazy Loading
- `<img loading="lazy">` 네이티브 속성 활용
- 뷰포트 진입 전: 회색 플레이스홀더
- 로드 실패 시: 기본 플레이스홀더 이미지 (onError)

### 2.3 메모이제이션
- 장바구니 총 금액 계산: useMemo
- 콜백 함수: useCallback
- 리스트 아이템 (MenuCard, CartItem, OrderCard): React.memo

## 3. 보안 패턴

### 3.1 인증 인터셉터
- `apiFetch`에서 Authorization 헤더 자동 첨부
- JWT exp 클레임 사전 확인, 만료 시 요청 전 로그아웃

### 3.2 XSS 방지
- React 기본 이스케이핑, dangerouslySetInnerHTML 사용 금지

### 3.3 민감 정보 보호
- 프로덕션 빌드에서 console.log 제거 (Vite 설정)

## 4. 데이터 영속성 패턴

### 4.1 localStorage 동기화
- 장바구니: useReducer dispatch 후 useEffect로 동기화
- 인증: login 시 저장, logout 시 클리어
- JSON.parse 실패 시 기본값 초기화
