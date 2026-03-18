# Services

## Backend Service Layer

### AuthService
- **책임**: 인증 로직 처리
- **오케스트레이션**:
  - 관리자 로그인: 자격 증명 검증 → JWT 토큰 발급
  - 테이블 로그인: 테이블 자격 증명 검증 → 세션 토큰 발급
- **의존**: AdminRepository, TableRepository, JwtUtil, PasswordEncoder

### MenuService
- **책임**: 메뉴 비즈니스 로직
- **오케스트레이션**:
  - 메뉴 CRUD 처리
  - 카테고리별 메뉴 조회
  - 메뉴 노출 순서 관리
- **의존**: MenuRepository, CategoryRepository, ImageService

### OrderService
- **책임**: 주문 비즈니스 로직
- **오케스트레이션**:
  - 주문 생성 → SSE 이벤트 발행
  - 주문 상태 변경 → SSE 이벤트 발행
  - 주문 삭제 → 테이블 총 주문액 재계산 → SSE 이벤트 발행
  - 세션별 주문 조회
- **의존**: OrderRepository, OrderItemRepository, SseService

### TableService
- **책임**: 테이블 관리 비즈니스 로직
- **오케스트레이션**:
  - 테이블 설정 및 세션 생성
  - 결제 완료: 주문 내역 → OrderHistory 이동 → 테이블 리셋 → SSE 이벤트 발행
  - 과거 주문 내역 조회 (날짜 필터링)
- **의존**: TableRepository, OrderRepository, OrderHistoryRepository, SseService

### SseService
- **책임**: SSE 연결 관리 및 이벤트 브로드캐스트
- **오케스트레이션**:
  - SSE 연결 등록/해제
  - 주문 이벤트 브로드캐스트 (신규 주문, 상태 변경, 삭제, 결제 완료)
- **의존**: SseEmitter 관리

### RecommendationService
- **책임**: AI 메뉴 추천 로직
- **오케스트레이션**:
  - 매장 메뉴 정보 조회 → OpenAI API 호출 → 추천 조합 2~3개 생성
- **의존**: MenuRepository, OpenAI API Client

### ImageService
- **책임**: 이미지 업로드/서빙
- **오케스트레이션**:
  - 이미지 파일 검증 → 로컬 파일시스템 저장 → URL 반환
- **의존**: 파일시스템 (Docker volume)
