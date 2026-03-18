# Business Logic Model — Unit 3: Admin App

## 1. 인증 로직 (프론트엔드)

### 로그인 플로우
1. 사용자가 storeId, username, password 입력
2. `POST /api/admin/auth/login` 호출
3. 성공 시: JWT 토큰을 localStorage에 저장, Redux auth state 업데이트, `/dashboard`로 이동
4. 실패 시: 에러 메시지 표시 (잘못된 자격 증명 / 계정 잠금)

### 세션 유지
- 페이지 로드 시 localStorage에서 토큰 확인
- 토큰 존재 시 exp 클레임 디코딩하여 만료 확인
- 만료된 토큰: localStorage에서 제거, `/login`으로 리다이렉트
- Axios interceptor: 모든 요청에 `Authorization: Bearer {token}` 헤더 추가
- 401 응답 수신 시: 토큰 제거, `/login`으로 리다이렉트

### 자동 로그아웃
- 토큰 만료 시간 기반 타이머 설정
- 만료 시 자동 로그아웃 처리 (state 초기화, localStorage 클리어, 리다이렉트)

## 2. 실시간 주문 모니터링 로직

### SSE 연결 관리
1. DashboardPage 마운트 시 `GET /api/admin/orders/stream` SSE 연결
2. EventSource 인스턴스 생성 (JWT 토큰은 URL 쿼리 파라미터 또는 커스텀 헤더로 전달)
3. 연결 해제: 페이지 언마운트 시 EventSource.close()
4. 재연결: 연결 끊김 시 자동 재연결 (EventSource 기본 동작)

### SSE 이벤트 → Redux State 업데이트
| Event | Redux Action | State 변경 |
|---|---|---|
| NEW_ORDER | `orders/newOrderReceived` | 해당 테이블의 orders 배열에 추가, totalAmount 재계산, 신규 플래그 설정 |
| ORDER_STATUS_CHANGED | `orders/orderStatusChanged` | 해당 주문의 status 업데이트 |
| ORDER_DELETED | `orders/orderDeleted` | 해당 주문 제거, totalAmount 재계산 |
| PAYMENT_COMPLETED | `tables/tableReset` | 해당 테이블의 orders 비우기, totalAmount 0으로 리셋 |

### 신규 주문 시각적 강조
- 신규 주문 수신 시 해당 TableCard에 `isHighlighted: true` 설정
- CSS 애니메이션 적용 (배경색 펄스)
- 2초 후 `isHighlighted: false`로 자동 해제

## 3. 주문 관리 로직

### 주문 상태 변경
1. OrderDetailModal에서 상태 Select 변경
2. `PUT /api/admin/orders/{id}/status` 호출 (body: { status })
3. 성공 시: Redux state 업데이트 (SSE로도 수신되지만 즉시 반영을 위해 낙관적 업데이트)
4. 실패 시: 에러 Snackbar 표시, 이전 상태로 롤백

### 주문 삭제
1. OrderDetailModal에서 삭제 버튼 클릭
2. 확인 Dialog 표시 ("이 주문을 삭제하시겠습니까?")
3. 확인 시 `DELETE /api/admin/orders/{id}` 호출
4. 성공 시: Modal 닫기, Redux state에서 주문 제거
5. 실패 시: 에러 Snackbar 표시

## 4. 결제 완료 로직

1. TableCard에서 "결제 완료" 버튼 클릭
2. PaymentCompleteModal 표시 (해당 테이블 총 주문 금액 표시)
3. "결제 완료 확정" 클릭 시 `POST /api/admin/tables/{id}/payment-complete` 호출
4. 성공 시: Modal 닫기, 성공 Snackbar (SSE PAYMENT_COMPLETED 이벤트로 테이블 리셋 반영)
5. 실패 시: 에러 Snackbar 표시

## 5. 메뉴 관리 로직

### 메뉴 CRUD
- **조회**: 페이지 로드 시 카테고리 목록 + 선택 카테고리의 메뉴 목록 로드
- **등록**: MenuFormModal에서 입력 → 이미지 있으면 먼저 `POST /api/admin/images` → `POST /api/admin/menus`
- **수정**: MenuFormModal에서 기존 데이터 프리필 → 수정 → 이미지 변경 시 새 업로드 → `PUT /api/admin/menus/{id}`
- **삭제**: 확인 Dialog → `DELETE /api/admin/menus/{id}` → 목록에서 제거

### 메뉴 순서 변경
1. 위/아래 화살표 클릭 시 로컬 배열에서 순서 swap
2. 변경된 순서 배열을 `PUT /api/admin/menus/order` 호출 (body: [{ menuId, displayOrder }])
3. 성공 시: Redux state 업데이트
4. 실패 시: 이전 순서로 롤백, 에러 Snackbar

### 이미지 업로드
1. MenuFormModal에서 파일 선택
2. 클라이언트 측 검증: 확장자 (jpg/jpeg/png/gif/webp), 크기 (최대 5MB)
3. 미리보기 표시 (URL.createObjectURL)
4. 폼 제출 시 `POST /api/admin/images` (multipart/form-data) → imageUrl 수신
5. imageUrl을 메뉴 등록/수정 요청에 포함

## 6. 테이블 설정 로직

1. tableNumber, password 입력
2. 클라이언트 검증 (필수 필드, tableNumber 양의 정수)
3. `POST /api/admin/tables` 호출
4. 성공 시: 성공 Snackbar, 폼 초기화
5. 실패 시: 에러 Snackbar (중복 테이블 번호 등)

## 7. 과거 주문 내역 조회 로직

1. TableCard에서 "과거 내역" 버튼 클릭
2. OrderHistoryModal 표시
3. `GET /api/admin/tables/{id}/history` 호출 (선택적 date 파라미터)
4. 날짜 필터 변경 시 재조회
5. 시간 역순 정렬로 표시
