# Integration Test Instructions — Unit 3: Admin App

## Purpose
Admin App(Unit 3)과 Backend API(Unit 1) 간의 통합을 검증합니다.

## Prerequisites
- Unit 1 Backend API가 `localhost:8080`에서 실행 중
- PostgreSQL DB에 seed 데이터 (매장, 관리자 계정, 테이블, 카테고리, 메뉴) 존재

## Setup Integration Test Environment

### 1. Start Backend Services
```bash
# Unit 1 담당자가 제공하는 방법으로 Backend + DB 실행
# 예: docker-compose up backend postgres
```

### 2. Start Admin App
```bash
cd frontend-admin
npm run dev
# → http://localhost:5174
```

## Test Scenarios

### Scenario 1: 관리자 로그인 → 대시보드 진입
- **Steps**:
  1. `http://localhost:5174/login` 접속
  2. 매장 식별자, 사용자명, 비밀번호 입력
  3. 로그인 버튼 클릭
- **Expected**: 대시보드 페이지로 이동, 테이블 그리드 표시
- **검증**: localStorage에 JWT 토큰 저장 확인

### Scenario 2: 실시간 주문 수신 (SSE)
- **Steps**:
  1. 관리자 로그인 후 대시보드 진입
  2. Customer App(Unit 2) 또는 API 직접 호출로 주문 생성
  3. 대시보드에서 신규 주문 표시 확인
- **Expected**: 2초 이내 테이블 카드에 신규 주문 표시, 배경색 애니메이션
- **검증**: 주문 번호, 금액, 상태(PENDING) 표시

### Scenario 3: 주문 상태 변경
- **Steps**:
  1. 대시보드에서 주문 카드 클릭
  2. 상태 Select에서 PREPARING 선택
- **Expected**: 상태 즉시 변경, 성공 Snackbar 표시
- **검증**: 새로고침 후에도 변경된 상태 유지

### Scenario 4: 주문 삭제
- **Steps**:
  1. 주문 상세 모달에서 "주문 삭제" 클릭
  2. 확인 Dialog에서 "삭제" 클릭
- **Expected**: 주문 제거, 총 주문액 재계산, 성공 Snackbar
- **검증**: 대시보드에서 해당 주문 사라짐

### Scenario 5: 결제 완료 처리
- **Steps**:
  1. 테이블 카드에서 결제 완료 아이콘 클릭
  2. 총 금액 확인 후 "결제 완료 확정" 클릭
- **Expected**: 테이블 주문 목록 비우기, 총 주문액 0
- **검증**: 과거 내역에서 이동된 주문 확인

### Scenario 6: 메뉴 CRUD
- **Steps**:
  1. 메뉴 관리 페이지 진입
  2. 메뉴 등록 (이름, 가격, 카테고리, 이미지)
  3. 메뉴 수정
  4. 메뉴 순서 변경 (화살표 버튼)
  5. 메뉴 삭제
- **Expected**: 각 작업 성공 Snackbar, 목록 즉시 반영
- **검증**: 새로고침 후에도 변경사항 유지

### Scenario 7: 테이블 초기 설정
- **Steps**:
  1. 테이블 설정 페이지 진입
  2. 테이블 번호, 비밀번호 입력 후 설정
- **Expected**: 성공 메시지, 폼 초기화
- **검증**: 대시보드에서 새 테이블 카드 표시

### Scenario 8: 세션 만료 자동 로그아웃
- **Steps**:
  1. 로그인 후 JWT 토큰의 exp를 과거 시간으로 수동 변경 (DevTools)
  2. 아무 API 호출 시도
- **Expected**: 자동 로그아웃, 로그인 페이지로 리다이렉트

## Cleanup
```bash
# 테스트 후 환경 정리
# docker-compose down (Backend 중지 시)
```
