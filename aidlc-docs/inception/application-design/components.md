# Components

## Backend Components (Spring Boot — Layered Architecture)

### 1. Auth Controller / Service / Repository
- **책임**: 관리자 로그인, JWT 발급/검증, 테이블 태블릿 인증
- **인터페이스**: REST API

### 2. Menu Controller / Service / Repository
- **책임**: 메뉴 CRUD, 카테고리 관리, 메뉴 노출 순서 관리
- **인터페이스**: REST API

### 3. Order Controller / Service / Repository
- **책임**: 주문 생성, 주문 조회, 주문 상태 변경, 주문 삭제
- **인터페이스**: REST API

### 4. Table Controller / Service / Repository
- **책임**: 테이블 설정, 세션 관리, 결제 완료 처리, 과거 내역 조회
- **인터페이스**: REST API

### 5. SSE Controller / Service
- **책임**: 실시간 주문 이벤트 스트리밍 (관리자 대시보드용)
- **인터페이스**: SSE endpoint

### 6. Recommendation Controller / Service
- **책임**: AI 메뉴 추천 (OpenAI API 호출), 추천 조합 생성
- **인터페이스**: REST API

### 7. Image Controller / Service
- **책임**: 메뉴 이미지 업로드, 이미지 서빙
- **인터페이스**: REST API (multipart upload)
- **저장**: 로컬 파일시스템 (Docker volume)

### 8. Global Components
- **Security Filter**: JWT 인증 필터, 요청 검증
- **Exception Handler**: 글로벌 에러 핸들링
- **CORS Config**: 프론트엔드 origin 허용 설정

---

## Frontend Components — Customer App (React, 모바일 웹)

### 1. SetupPage
- **책임**: 테이블 초기 설정 (매장 ID, 테이블 번호, 비밀번호)

### 2. MenuPage
- **책임**: 카테고리별 메뉴 목록, 메뉴 상세, 장바구니 추가

### 3. CartComponent
- **책임**: 장바구니 표시, 수량 조절, 삭제, 총 금액 계산

### 4. OrderConfirmPage
- **책임**: 주문 최종 확인, 주문 확정

### 5. OrderSuccessPage
- **책임**: 주문 성공 표시, 5초 후 메뉴 리다이렉트

### 6. OrderHistoryPage
- **책임**: 현재 세션 주문 내역 조회

### 7. RecommendationModal
- **책임**: 인원수/식사유형 입력, AI 추천 결과 표시, 장바구니 일괄 추가

---

## Frontend Components — Admin App (React, 데스크톱 웹)

### 1. LoginPage
- **책임**: 관리자 로그인

### 2. DashboardPage
- **책임**: 테이블별 그리드 레이아웃, 실시간 주문 모니터링 (SSE)

### 3. TableCard
- **책임**: 개별 테이블 카드 (총 주문액, 최신 주문 미리보기)

### 4. OrderDetailModal
- **책임**: 주문 상세 보기, 상태 변경

### 5. PaymentCompleteModal
- **책임**: 결제 완료 확인 팝업, 테이블 초기화

### 6. OrderHistoryModal
- **책임**: 과거 주문 내역 조회, 날짜 필터링

### 7. MenuManagementPage
- **책임**: 메뉴 CRUD, 이미지 업로드, 노출 순서 조정

### 8. TableSetupPage
- **책임**: 테이블 태블릿 초기 설정
