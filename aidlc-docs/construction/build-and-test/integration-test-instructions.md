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
