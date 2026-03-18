# Integration Test Instructions — Unit 2: Customer App

## 목적
Customer App (Unit 2) ↔ Backend API (Unit 1) 간 REST API 통합 검증

## 사전 조건
- Unit 1 (Backend API)가 localhost:8080에서 실행 중
- PostgreSQL이 실행 중이고 seed 데이터 적용됨
- 테스트용 매장/테이블/메뉴 데이터가 DB에 존재

## 통합 테스트 환경 구성

### Docker Compose로 전체 환경 실행
```bash
# 프로젝트 루트에서
docker-compose up -d
```

### 서비스 상태 확인
```bash
# Backend API 헬스체크
curl http://localhost:8080/api/categories
# → 200 OK, 카테고리 목록 반환

# Customer App 접근
curl http://localhost:3001
# → 200 OK, index.html 반환
```

## 통합 테스트 시나리오

### Scenario 1: 테이블 로그인 플로우
1. Customer App (http://localhost:3001) 접속
2. /setup 페이지에서 매장 식별자, 테이블 번호, 비밀번호 입력
3. **검증**: `POST /api/table/auth/login` → 200 OK, JWT 토큰 반환
4. **검증**: 자동으로 /menu 페이지로 이동
5. **검증**: localStorage에 auth_token, session_id 저장됨

### Scenario 2: 메뉴 조회 플로우
1. 로그인 상태에서 /menu 접근
2. **검증**: `GET /api/categories` → 카테고리 탭 표시
3. 카테고리 탭 클릭
4. **검증**: `GET /api/menus?category={id}` → 해당 카테고리 메뉴 카드 표시
5. 메뉴 카드 클릭
6. **검증**: 메뉴 상세 모달에 이름, 가격, 설명, 이미지 표시

### Scenario 3: 장바구니 → 주문 플로우
1. 메뉴 카드에서 + 버튼으로 장바구니 추가
2. /cart 페이지에서 수량 조절
3. "주문하기" → /order-confirm 이동
4. "주문 확정" 클릭
5. **검증**: `POST /api/orders` → 201 Created, 주문 번호 반환
6. **검증**: /order-success 페이지에 주문 번호 표시
7. **검증**: 5초 후 /menu 자동 이동
8. **검증**: 장바구니 비워짐

### Scenario 4: 추가 주문 플로우
1. Scenario 3 완료 후 /menu에서 새 메뉴 장바구니 추가
2. 주문 확정
3. **검증**: 새 주문 번호 부여, 동일 세션 ID

### Scenario 5: 주문 내역 조회
1. /orders 페이지 접근
2. **검증**: `GET /api/orders?sessionId={id}` → 현재 세션 주문 목록
3. **검증**: 각 주문에 주문 번호, 시각, 메뉴/수량, 금액, 상태 표시

### Scenario 6: AI 메뉴 추천
1. /menu에서 "메뉴 추천" 버튼 클릭
2. 인원수 2, 식사 유형 "쉐어" 입력
3. "추천 받기" 클릭
4. **검증**: `POST /api/recommendations` → 2~3개 추천 조합 반환
5. 조합 선택
6. **검증**: 해당 메뉴들이 장바구니에 일괄 추가됨

### Scenario 7: Nginx API 프록시 (Docker 환경)
1. Docker Compose 환경에서 http://localhost:3001/api/categories 접근
2. **검증**: Nginx가 backend:8080으로 프록시하여 정상 응답

## 수동 테스트 체크리스트

- [ ] 테이블 로그인 성공/실패
- [ ] 자동 로그인 (새로고침 후)
- [ ] 카테고리별 메뉴 조회
- [ ] 메뉴 상세 모달
- [ ] 장바구니 추가/수량 조절/삭제/비우기
- [ ] 장바구니 새로고침 유지 (localStorage)
- [ ] 주문 확정 → 성공 → 5초 리다이렉트
- [ ] 추가 주문
- [ ] AI 메뉴 추천 → 장바구니 일괄 추가
- [ ] 주문 내역 조회
- [ ] 401 시 자동 로그아웃

## 정리
```bash
docker-compose down
```
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
