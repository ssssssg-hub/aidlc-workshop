# Integration Test Instructions — Unit 1: Backend API

## 목적
Testcontainers를 사용하여 실제 PostgreSQL과 Spring Boot 애플리케이션의 통합을 검증합니다.

## Prerequisites
- Docker 실행 중 (Testcontainers가 PostgreSQL 컨테이너를 자동 생성)

## 테스트 시나리오

### Scenario 1: Application Context 로딩
- Spring Boot 애플리케이션이 PostgreSQL과 함께 정상 기동
- Flyway 마이그레이션 자동 실행
- 모든 Bean 정상 등록

### Scenario 2: 인증 → 주문 → 결제 완료 플로우
1. 관리자 로그인 → JWT 토큰 발급
2. 테이블 설정 → 테이블 로그인 → 세션 생성
3. 메뉴 등록 (관리자)
4. 주문 생성 (테이블)
5. 주문 상태 변경 (관리자)
6. 결제 완료 (관리자) → 이력 이동 확인

### Scenario 3: SSE 실시간 이벤트
1. SSE 구독 연결
2. 주문 생성 → NEW_ORDER 이벤트 수신 확인
3. 상태 변경 → ORDER_STATUS_CHANGED 이벤트 수신 확인

## 실행 방법

### Integration Test 실행
```bash
cd backend
./gradlew test --tests "com.tableorder.TableOrderApplicationTests"
```

### 전체 테스트 (단위 + 통합)
```bash
cd backend
./gradlew test
```

## 예상 결과
- Application Context 정상 로딩
- Flyway 마이그레이션 성공 (V1, V2)
- 모든 Repository 정상 동작

## 주의사항
- Testcontainers는 Docker가 실행 중이어야 합니다
- 첫 실행 시 PostgreSQL 이미지 다운로드로 시간이 걸릴 수 있습니다
