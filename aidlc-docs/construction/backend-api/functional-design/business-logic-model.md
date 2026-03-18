# Business Logic Model — Unit 1: Backend API

## 1. 인증 로직

### 관리자 로그인
1. storeIdentifier로 Store 조회
2. username + storeId로 Admin 조회
3. 잠금 상태 확인 (lockedUntil > now → 거부)
4. bcrypt로 비밀번호 검증
5. 실패 시: failedLoginAttempts 증가, 5회 도달 시 lockedUntil = now + 15분
6. 성공 시: failedLoginAttempts 리셋, JWT 토큰 발급 (16시간 만료, storeId/adminId/role 포함)

### 테이블 로그인
1. storeIdentifier로 Store 조회
2. tableNumber + storeId로 Table 조회
3. bcrypt로 비밀번호 검증
4. 성공 시: 새 TableSession 생성 (UUID, active=true), JWT 토큰 발급 (16시간 만료, storeId/tableId/sessionId 포함)

### JWT 검증
1. Authorization 헤더에서 Bearer 토큰 추출
2. 서명 검증 + 만료 확인
3. 토큰에서 사용자 정보 추출 (role: ADMIN 또는 TABLE)
4. SecurityContext에 인증 정보 설정

## 2. 주문 처리 로직

### 주문 생성
1. 요청 검증 (세션 활성 상태, 메뉴 존재 여부)
2. 주문 번호 자동 생성 (예: ORD-{yyyyMMdd}-{sequence})
3. Order + OrderItem 저장
4. totalAmount 계산 (각 item의 unitPrice × quantity 합산)
5. SSE 이벤트 발행 (NEW_ORDER)
6. OrderResponse 반환

### 주문 상태 변경
1. 주문 존재 확인
2. 상태 변경 (자유 변경 허용: PENDING ↔ PREPARING ↔ COMPLETED)
3. updatedAt 갱신
4. SSE 이벤트 발행 (ORDER_STATUS_CHANGED)

### 주문 삭제
1. 주문 존재 확인
2. Order + OrderItem 삭제
3. SSE 이벤트 발행 (ORDER_DELETED, tableId 포함)

## 3. 테이블 세션 관리 로직

### 세션 생성
- 테이블 로그인 성공 시 자동 생성
- 기존 활성 세션이 있으면 그대로 유지 (새 세션 생성하지 않음)

### 결제 완료 처리
1. 테이블의 활성 세션 조회
2. 해당 세션의 모든 Order 조회
3. 각 Order → OrderHistory로 복사 (OrderItem → OrderHistoryItem)
4. completedAt = now 설정
5. 원본 Order + OrderItem 삭제
6. TableSession.active = false, endedAt = now
7. SSE 이벤트 발행 (PAYMENT_COMPLETED, tableId 포함)

### 과거 내역 조회
1. tableId로 OrderHistory 조회
2. 날짜 필터링 적용 (선택적)
3. 시간 역순 정렬

## 4. AI 추천 로직

### 추천 요청 처리
1. 매장의 전체 메뉴 목록 조회 (카테고리 포함)
2. OpenAI API 호출:
   - System prompt: 메뉴 목록, 카테고리, 가격 정보 제공
   - User prompt: 인원수, 식사 유형(쉐어/단독)
   - 응답 형식: JSON (2~3개 추천 조합, 각 조합에 메뉴ID/수량/이유)
3. 응답 파싱 및 검증 (존재하는 메뉴인지 확인)
4. 각 조합의 예상 총 금액 계산
5. RecommendationResponse 반환

## 5. 이미지 업로드 로직

### 업로드
1. MultipartFile 수신
2. 파일 검증 (확장자: jpg/jpeg/png/gif/webp, 크기: 최대 5MB)
3. 고유 파일명 생성 (UUID + 원본 확장자)
4. 로컬 파일시스템에 저장 (설정된 upload 디렉토리)
5. 접근 URL 반환 (/api/images/{filename})

### 서빙
1. filename으로 파일 조회
2. Content-Type 설정 후 바이트 스트림 반환

## 6. SSE 이벤트 관리

### 연결 관리
- 관리자 접속 시 SseEmitter 생성 (timeout: 30분)
- 연결 해제 시 emitter 제거
- 주기적 heartbeat (30초 간격)

### 이벤트 타입
| Event | Payload | Trigger |
|---|---|---|
| NEW_ORDER | Order 전체 정보 | 주문 생성 |
| ORDER_STATUS_CHANGED | orderId, newStatus | 상태 변경 |
| ORDER_DELETED | orderId, tableId | 주문 삭제 |
| PAYMENT_COMPLETED | tableId | 결제 완료 |
